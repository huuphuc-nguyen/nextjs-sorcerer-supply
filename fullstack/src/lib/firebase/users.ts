import { db } from '@/lib/firebase/config'
import { setDoc, doc, getDoc } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth(); 

interface User {
    id: string,
    address: string,
    fullname: string,
    email: string,
    payment: string
};

async function createUserInDatabase() {

    onAuthStateChanged(auth, (user) => {
        if (user) {
          const userId = user.uid;
          const userEmail = user.email;

          sessionStorage.setItem("userId", userId);

          setDoc(doc(db, "users", userId), {
            fullname: "",
            email: userEmail,
            address: "",
            payment: "",
        });

        } else {
          console.log("No user is signed in.");
        }
      });
}

async function getUserFromDatabase(userId: string): Promise<User | null> {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data() as User;
    } else {
        console.log("No such user!");
        return null;
    }
}

async function updateUserInDatabase(userId: string, userData: Partial<User>) {
    const docRef = doc(db, "users", userId);
    return setDoc(docRef, userData, { merge: true })
}

export { createUserInDatabase, getUserFromDatabase, updateUserInDatabase};

export type { User };