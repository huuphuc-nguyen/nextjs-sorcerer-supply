import { CartItem } from '@/app/productPage/[collectionName]/[id]/page';
import { db } from '@/lib/firebase/config'
import { doc, updateDoc, arrayUnion, getDoc, collection, getDocs } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {toast} from "@/hooks/use-toast";

const auth = getAuth();

export type Order = {
    id: string;
    status: string;
    createdAt: string;
    products: CartItem[];
    total: number;
  };

export type AdminOrder = Order & {
    customerFullname: string;
    customerEmail: string;
    userId: string;
}

function generateOrderId(): string {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 1000);
  return `order-${timestamp}-${randomNum}`;
}

export const createOrderInDatabase = async (products: CartItem[], totalPayment: number ) => {
    
        onAuthStateChanged(auth, async (user) => {
            if (user) {
              const userId = user.uid;
    
              const userDocRef = doc(db, "users", userId);

              try {
                await updateDoc(userDocRef, {
                  orders: arrayUnion({
                    id: generateOrderId(),
                    products,
                    createdAt: new Date().toISOString(),
                    status: "pending",
                    total: totalPayment,
                  }),
                });
        
                console.log("Order added to user doc");
              } catch (error) {
                console.error("Failed to add order:", error);
              }
    
            } else {
              console.log("No user is signed in.");
              toast({
                title: "Error",
                description: "Please login to create an order.",
                variant: "destructive",
              })
            }
          });
}

export const getThisUserOrdersFromDatabase = (): Promise<Order[]> => {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userId = user.uid;
          const userDocRef = doc(db, "users", userId);
  
          try {
            const docSnap = await getDoc(userDocRef);
            if (docSnap.exists()) {
              const data = docSnap.data();
              resolve(data.orders || []);
            } else {
              resolve([]);
            }
          } catch (error) {
            console.error("Failed to fetch orders:", error);
            reject(error);
          }
        } else {
          console.log("No user is signed in.");
          resolve([]);
        }
      });
    });
  };

export const getAllOrdersFromDatabase = async (): Promise<AdminOrder[]> => {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const usersCollection = collection(db, "users");

        try {
          const docSnap = await getDocs(usersCollection);

          const allOrders : AdminOrder[] = [];

          docSnap.forEach((doc) => {
            const userOrders = doc.data().orders as Order[];
            const userFullName = doc.data().fullname || "Unknown User";
            const userEmail = doc.data().email || "Unknown Email";
            const userId = doc.id;

            if (userOrders && Array.isArray(userOrders)) {
                userOrders.forEach((order) => {
                    const orderWithUserInfo: AdminOrder = {
                        ...order,
                        customerFullname: userFullName,
                        customerEmail: userEmail,
                        userId: userId,
                    }
                    allOrders.push(orderWithUserInfo); // You can customize this part if you want to store more information about each order
                });
            }
          });

          if (allOrders.length > 0) {
            resolve(allOrders);
          } else {
            resolve([]);
          }
        } catch (error) {
          console.error("Failed to fetch orders:", error);
          reject(error);
        }
      } else {
        console.log("No user is signed in.");
        resolve([]);
      }
    });
  });
}

export const updateOrderStatus = async (userId: string ,orderId: string, status: string) => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userDocRef = doc(db, "users", userId);
    
          try {
            const docSnap = await getDoc(userDocRef);
            if (docSnap.exists()) {
              const data = docSnap.data();
              const orders = data.orders  as Order[];

              const updatedOrders = orders.map((order: Order) => {
                if (order.id === orderId) {
                  return { ...order, status };
                }
                return order;
              });
    
              await updateDoc(userDocRef, { orders: updatedOrders });
              console.log("Order status updated successfully");
            } else {
              console.log("No such document!");
            }
          } catch (error) {
            console.error("Error updating order status:", error);
          }
        } else {
          console.log("No user is signed in.");
        }
      });
}
  