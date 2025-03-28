import { db } from '@/lib/firebase/config'
import { collection, DocumentData, getDocs, QueryDocumentSnapshot, query, limit, where } from 'firebase/firestore'

const collectionNames = ["wands", "spellBooks", "staffs", "scrolls", "magicItems", "ingredients", "cursedItems", "creatures"];

interface Product {
    id: string,
    imageSrc: string,
    name: string,
    price: number
    collectionName: string
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
                        collectionName: doc.data().collectionName
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
        collectionName: doc.data().collectionName
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

export { getProductDocuments, getProducts, searchProducts };

export type { Product };