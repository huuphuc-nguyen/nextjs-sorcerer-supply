import { db } from '@/lib/firebase/config'
import { collection, DocumentData, getDocs, QueryDocumentSnapshot, query, limit, setDoc, doc } from 'firebase/firestore'

const collectionNames = ["wands", "spellBooks", "staffs", "scrolls", "magicItems", "ingredients", "cursedItems", "creatures"];

interface Product {
    id: string,
    imageSrc: string,
    name: string,
    price: number,
    collectionName: string,
    description?: string,
    inStock?: boolean,
    quantity?: number,
};

async function searchProducts(searchTerm: string): Promise<Product[]> {
    const searchResults: Product[] = [];

    try {
        for (const col of collectionNames) {
            const colRef = collection(db, col);
            const q = query(colRef);
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                if (doc.data().name.toUpperCase().includes(searchTerm.toUpperCase())) {
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
    }
    catch (err) {
        console.error("Error searching for documents:", err);
        return [];
    }
}

async function getProducts(): Promise<Product[]> {
    const docs = await getProductDocuments();
    return docs.map(doc => ({
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

async function getProductDocuments(): Promise<QueryDocumentSnapshot<DocumentData>[]> {
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

async function updateProductQuantity(collectionName: string, id: string, quantity: number) {
    try {
        const docRef = doc(db, collectionName, id);
        
        await setDoc(docRef, { quantity: quantity < 0 ? 0 : quantity, inStock: quantity > 0 ? true : false }, { merge: true });

    } catch (error) {
        console.error("Error updating product quantity:", error);
    }
}

async function updateProductPrice(collectionName: string,id: string,price: number) {
    try {
      const docRef = doc(db, collectionName, id)
      await setDoc(
        docRef,
        { price: price < 0 ? 0 : price },  
        { merge: true }
      )
    } catch (error) {
      console.error('Error updating product price:', error)
    }
  }

  async function updateProductName(collectionName: string,id: string,name: string) {
    try {
      const docRef = doc(db, collectionName, id)
      await setDoc(
        docRef,
        { name: name.trim() }, 
        { merge: true }
      )
    } catch (error) {
      console.error('Error updating product name:', error)
    }
  }
  
  async function updateProductDescription(collectionName: string,id: string,description: string) {
    try {
      const docRef = doc(db, collectionName, id)
      await setDoc(
        docRef,
        { description: description.trim() },
        { merge: true }
      )
    } catch (error) {
      console.error('Error updating product description:', error)
    }
  }

export { getProductDocuments, getProducts, searchProducts, updateProductQuantity,
     updateProductPrice, updateProductName, updateProductDescription };

export type { Product };