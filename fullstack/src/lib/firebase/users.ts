import { db } from '@/lib/firebase/config'
import { setDoc, doc } from 'firebase/firestore'
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

export { createUserInDatabase };

export type { User };