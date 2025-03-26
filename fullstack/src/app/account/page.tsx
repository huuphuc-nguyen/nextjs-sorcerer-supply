"use client"; // Ensures this component is rendered only on the client side

import { useEffect, useState } from "react";
import { useRouter } from 'nextjs-toploader/app';
import { auth } from '@/lib/firebase/config';
import { LoadingSpinner } from '@/components/ui/spinner';
import { Pencil } from "lucide-react";
import { getUserFromDatabase, updateUserInDatabase} from "@/lib/firebase/users";
import { toast } from "@/hooks/use-toast";

const Account = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [fullName, setFullName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [payment, setPayment] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") { // Ensure sessionStorage access happens only client-side

      // Firebase authentication
      auth.onAuthStateChanged(user => {
        if (!user) {
          sessionStorage.setItem("redirectAfterLogin", "/account");
          router.push('/login');
        } else {
          setLoading(false);
        }
      });
    }
  }, [router]); // Only run once on initial mount

  useEffect(() => {

    auth.onAuthStateChanged((user) => {
    const uid =user?.uid;
        
    if (uid) {
        setUserId(uid);
        getUserFromDatabase(uid).then((user) => {
            setFullName(user?.fullname || "");
            setEmail(user?.email || "");
            setAddress(user?.address || "");
            setPayment(user?.payment || "");
            console.log("User:", user);
          }).catch((error) => {
            console.error("Error fetching user data:", error);
            }
            ).finally(() => {
              setLoading(false);
              console.log("Loading finished");
            }   
            );
    }
    })

    
  }, []);



  // Handle Save button click to update user information
  const handleSaveClicked = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsSaving(true);
    if (userId) {
      await updateUserInDatabase(userId, { fullname: fullName, address: address })
        .then(() => {
          setIsSaving(false);
          toast({
            title: "Changes saved",
            variant: "success",
            description: "Your changes have been saved successfully.",
          });
        })
        .catch((error) => {
          setIsSaving(false);
          toast({
            title: "Error saving data",
            variant: "destructive",
            description: `Error saving user data: ${error}`,
          });
          console.error("Error saving user data:", error);
        });
    }
  };

  if (loading) {
    return <div className="h-screen grid place-content-center"><LoadingSpinner /></div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start gap-10 p-16">
      <h1 className="text-2xl font-semibold">Account</h1>
      {/* Profile Section */}
      <form className="border border-dashed rounded-xl px-16 py-6 w-1/2 grid place-items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full items-center">
          <div className="text-md flex items-center">
            <strong>Full Name:</strong>
          </div>

          <label className="relative w-full text-white">
            <input
              type="text"
              className="text-md border rounded-md p-4 flex flex-row items-center bg-inherit w-full
                         focus:border-yellow-600 focus:border focus:outline-none transition-all duration-300"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)} // Updates local state without resetting from sessionStorage
            />
            <Pencil className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer" size={16} />
          </label>

          <div className="text-md">
            <strong>Email:</strong>
          </div>
          <label className="relative w-full text-white">
            <input
              type="text"
              className="text-md border rounded-md p-4 flex flex-row items-center bg-inherit w-full"
              value={email}
              disabled
            />
          </label>

          <div className="text-md">
            <strong>Address:</strong>
          </div>
          <label className="relative w-full text-white">
            <input
              type="text"
              className="text-md border rounded-md p-4 flex flex-row items-center bg-inherit w-full
                         focus:border-yellow-600 focus:border focus:outline-none transition-all duration-300"
              value={address}
              onChange={(e) => setAddress(e.target.value)} // Updates local state without resetting from sessionStorage
            />
            <Pencil className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer" size={16} />
          </label>

          <div className="text-md">
            <strong>Payment Method:</strong>
          </div>
          <label className="relative w-full text-white">
            <input
              type="text"
              className="text-md border rounded-md p-4 flex flex-row items-center bg-inherit w-full"
              value={payment}
              disabled
            />
          </label>
        </div>

        <button
          className="my-10 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
          onClick={(e) => handleSaveClicked(e)}
          disabled={isSaving}
        >
          {isSaving ? <LoadingSpinner /> : "Save Changes"}
        </button>
      </form>
    </main>
  );
};

export default Account;
