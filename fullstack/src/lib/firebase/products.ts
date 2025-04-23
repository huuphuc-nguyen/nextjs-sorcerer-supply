import { db } from "@/lib/firebase/config";
import { addDoc } from "firebase/firestore";
import { deleteDoc } from "firebase/firestore";
import {
  collection,
  DocumentData,
  getDocs,
  QueryDocumentSnapshot,
  query,
  limit,
  setDoc,
  doc,
  getDoc,
} from "firebase/firestore";

const collectionNames = [
  "wands",
  "spellBooks",
  "staffs",
  "scrolls",
  "magicItems",
  "ingredients",
  "cursedItems",
  "creatures",
];

interface Product {
  id: string;
  imageSrc: string;
  name: string;
  price: number;
  collectionName: string;
  description?: string;
  inStock?: boolean;
  quantity?: number;
}

async function searchProducts(searchTerm: string): Promise<Product[]> {
  const searchResults: Product[] = [];

  // Get the uppercase search term
  const searchTermUpper = searchTerm.toUpperCase();

  try {
    for (const col of collectionNames) {
      const colRef = collection(db, col);
      const q = query(colRef);
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        // Check if the product name contains the search term
        const nameContains = doc
          .data()
          .name.toUpperCase()
          .includes(searchTermUpper);

        // Check if the description contains the search term
        const descSplit = doc
          .data()
          .description.split(" ")
          .map((part: string) => part.toUpperCase());
        const descContains = descSplit.some((part: string | string[]) =>
          part.includes(searchTermUpper),
        );

        // If the name or desc contains the search term, add it to the results
        if (nameContains || descContains) {
          searchResults.push({
            id: doc.id,
            imageSrc: doc.data().imageSrc,
            name: doc.data().name,
            price: doc.data().price,
            collectionName: doc.data().collectionName,
            description: doc.data().description,
            inStock: doc.data().inStock,
            quantity: doc.data().quantity,
          });
        }
      });
    }
    return searchResults;
  } catch (err) {
    console.error("Error searching for documents:", err);
    return [];
  }
}

async function getProducts(): Promise<Product[]> {
  const docs = await getProductDocuments();
  return docs.map((doc) => ({
    id: doc.id,
    imageSrc: doc.data().imageSrc,
    name: doc.data().name,
    price: doc.data().price,
    collectionName: doc.data().collectionName,
    description: doc.data().description,
    inStock: doc.data().inStock,
    quantity: doc.data().quantity,
  }));
}

async function getProductDocuments(): Promise<
  QueryDocumentSnapshot<DocumentData>[]
> {
  try {
    let allDocs: QueryDocumentSnapshot<DocumentData>[] = [];

    for (const collectionName of collectionNames) {
      const collectionRef = collection(db, collectionName);
      const limitedDocs = query(collectionRef, limit(3));
      const querySnapshot = await getDocs(limitedDocs);
      allDocs = [...allDocs, ...querySnapshot.docs];
    }

    return allDocs;
  } catch (error) {
    console.error("Error fetching product documents:", error);
    return [];
  }
}

async function updateProductQuantity(
  collectionName: string,
  id: string,
  quantity: number,
) {
  try {
    const docRef = doc(db, collectionName, id);

    await setDoc(
      docRef,
      {
        quantity: quantity < 0 ? 0 : quantity,
        inStock: quantity > 0 ? true : false,
      },
      { merge: true },
    );
  } catch (error) {
    console.error("Error updating product quantity:", error);
  }
}

async function getProductByID(collectionName: string, id: string) {
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as Product;
  } else {
    return null;
  }
}

async function updateProductPrice(
  collectionName: string,
  id: string,
  price: number,
) {
  try {
    const docRef = doc(db, collectionName, id);
    await setDoc(docRef, { price: price < 0 ? 0 : price }, { merge: true });
  } catch (error) {
    console.error("Error updating product price:", error);
  }
}

async function updateProductName(
  collectionName: string,
  id: string,
  name: string,
) {
  try {
    const docRef = doc(db, collectionName, id);
    await setDoc(docRef, { name: name.trim() }, { merge: true });
  } catch (error) {
    console.error("Error updating product name:", error);
  }
}

async function updateProductDescription(
  collectionName: string,
  id: string,
  description: string,
) {
  try {
    const docRef = doc(db, collectionName, id);
    await setDoc(docRef, { description: description.trim() }, { merge: true });
  } catch (error) {
    console.error("Error updating product description:", error);
  }
}
async function addProductToDatabase(
  category: string,
  data: {
    name: string;
    price: number;
    quantity: number;
    description: string;
    imageSrc: string;
  },
) {
  const colRef = collection(db, category);
  await addDoc(colRef, {
    name: data.name,
    price: data.price,
    quantity: data.quantity,
    description: data.description,
    imageSrc: data.imageSrc,
    collectionName: category,
    inStock: data.quantity > 0,
  });
}
async function deleteProductFromDatabase(category: string, id: string) {
  const docRef = doc(db, category, id);
  await deleteDoc(docRef);
}



 async function createDiscountCode(code: string, amount: number) {
  if (!code.trim()) throw new Error("Code cannot be empty");
  if (amount <= 0)   throw new Error("Amount must be > 0");

  // point at the collection only
  const colRef = collection(db, "discountCodes");

  // addDoc → Firestore assigns a 20-char random ID
  const docRef = await addDoc(colRef, {
    code: code.toUpperCase(),
    amount,
  });

  return docRef;                  // docRef.id is the new random ID
}

interface Discount {
  id: string;         
  code: string;       
  amount: number;      
}

async function getDiscountCodes(): Promise<Discount[]> {
  try {
    const q = query(
      collection(db, "discountCodes"),
    );

    const snap = await getDocs(q);

    return snap.docs.map((d: QueryDocumentSnapshot<DocumentData>) => ({
      id: d.id,
      code: d.data().code,
      amount: d.data().amount,
    }));
  } catch (err) {
    console.error("Error fetching discount codes:", err);
    return [];
  }
}

async function deleteDiscountCode(id:string,code:string) {
  await deleteDoc(doc(db, "discountCodes", id));
}
 async function updateDiscountCode(
  id: string,
  code: string,
  amount: number
) {
  const docRef = doc(db, "discountCodes", id);

  await setDoc(
    docRef,
    { code: code.toUpperCase(), amount }, // merge just these fields
    { merge: true }
  );
}
export {
  getProductDocuments,
  getProducts,
  searchProducts,
  updateProductQuantity,
  updateProductPrice,
  updateProductName,
  updateProductDescription,
  addProductToDatabase,
  deleteProductFromDatabase,
  getProductByID,
  createDiscountCode,
  getDiscountCodes,
  deleteDiscountCode,
  updateDiscountCode,
};

export type { Product ,Discount};
