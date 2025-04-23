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
    // Shipping details
    address: string;
    city: string;
    state: string;
    zip: string;
    fullName: string;
    email: string;
  };

export type AdminOrder = Order & {
    customerFullname: string;
    customerEmail: string;
    userId: string;
}

interface shippingDetails {
  fullName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

function generateOrderId(): string {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 1000);
  return `order-${timestamp}-${randomNum}`;
}

export const createOrderInDatabase = async (products: CartItem[], totalPayment: number, shippingDetails: shippingDetails ) => {
    
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
                    fullName: shippingDetails.fullName,
                    email: shippingDetails.email,
                    address: shippingDetails.address,
                    city: shippingDetails.city,
                    state: shippingDetails.state,
                    zip: shippingDetails.zip,
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

export const getUserOrderFromDatabase = async (userId: string, orderId: string): Promise<AdminOrder> => {
  return new Promise((resolve, reject) => {
    try{
      getDoc(doc(db, "users", userId)).then((docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
            const userId = docSnap.id;
          const orders = data.orders as Order[];
          const order = orders.find((order: Order) => order.id === orderId);
          const userEmail = data.email as string;
          const userFullName = data.fullname as string;
          if (order) {
            const orderWithUserInfo: AdminOrder = {
              ...order,
              customerFullname: userFullName,
              customerEmail: userEmail,
              userId: userId,
            };
            resolve(orderWithUserInfo);
          } else {
            reject(new Error("Order not found"));
          }
        } else {
          reject(new Error("User document not found"));
        }
      });
    }
    catch (error) {
      console.error("Failed to fetch order:", error);
      reject(error);
    }
  })
}

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
            const userId = doc.id;
            const userEmail = doc.data().email as string;
            const userFullName = doc.data().fullname as string;

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
  ;
  