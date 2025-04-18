import { CartItem } from '@/app/productPage/[collectionName]/[id]/page';
import { db } from '@/lib/firebase/config'
import { doc, updateDoc, arrayUnion, getDoc, collection, getDocs } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {toast} from "@/hooks/use-toast";

const auth = getAuth();

export type Order = {
    status: string;
    createdAt: string;
    products: CartItem[];
  };

export type AdminOrder = Order & {
  
}

export const createOrderInDatabase = async (products: CartItem[] ) => {
    
        onAuthStateChanged(auth, async (user) => {
            if (user) {
              const userId = user.uid;
    
              const userDocRef = doc(db, "users", userId);

              try {
                await updateDoc(userDocRef, {
                  orders: arrayUnion({
                    products,
                    createdAt: new Date().toISOString(),
                    status: "pending",
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

export const getAllOrdersFromDatabase = async (): Promise<Order[]> => {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const usersCollection = collection(db, "users");

        try {
          const docSnap = await getDocs(usersCollection);

          const allOrders : Order[] = [];

          docSnap.forEach((doc) => {
            const userOrders = doc.data().orders;

            if (userOrders && Array.isArray(userOrders)) {
                userOrders.forEach((order) => {
                    allOrders.push(order); // You can customize this part if you want to store more information about each order
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
  