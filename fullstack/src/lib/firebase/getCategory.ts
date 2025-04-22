import {
  collection,
  getDocs,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "./config";

export async function getCategory(collectionName: string) {
  try {
    const collectionRef = collection(db, collectionName);
    const querySnapshot: QuerySnapshot<DocumentData> =
      await getDocs(collectionRef);
    if (!querySnapshot.empty) {
      const documents = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        price: doc.data().price,
        imageSrc: doc.data().imageSrc,
        collectionName: doc.data().collectionName || collectionName, // Add collectionName if missing
      }));
      return documents;
    } else {
      console.log("No products found in this category!");
      throw new Error(`No products found in the ${collectionName} category.`);
    }
  } catch (error) {
    console.error(`Error fetching category ${collectionName}:`, error);
    throw new Error(
      `Failed to fetch data from the ${collectionName} category.`,
    );
  }
}
