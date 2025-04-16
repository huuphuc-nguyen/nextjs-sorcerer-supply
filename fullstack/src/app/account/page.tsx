"use client"; // Ensures this component is rendered only on the client side

import { useEffect, useState } from "react";
import { useRouter } from "nextjs-toploader/app";
import { auth } from "@/lib/firebase/config";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Pencil } from "lucide-react";
import {
  getUserFromDatabase,
  updateUserInDatabase,
} from "@/lib/firebase/users";
import { toast } from "@/hooks/use-toast";
import { getOrdersFromDatabase, Order } from "@/lib/firebase/order";
import Image from "next/image";

const Account = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [fullName, setFullName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [payment, setPayment] = useState<string>("");
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Ensure sessionStorage access happens only client-side

      // Firebase authentication
      auth.onAuthStateChanged((user) => {
        if (!user) {
          sessionStorage.setItem("redirectAfterLogin", "/account");
          router.replace("/login");
        } else {
          setLoading(false);
        }
      });
    }
  }, [router]); // Only run once on initial mount

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      const uid = user?.uid;

      if (uid) {
        setUserId(uid);
        getUserFromDatabase(uid)
          .then((user) => {
            setFullName(user?.fullname || "");
            setEmail(user?.email || "");
            setAddress(user?.address || "");
            setPayment(user?.payment || "");
            console.log("User:", user);
          })
          .catch((error) => {
            console.error("Error fetching user data:", error);
          })
          .finally(() => {
            setLoading(false);
            console.log("Loading finished");
          });
      }
    });
  }, []);

  // Fetch order history
  useEffect(() => {
    const fetchOrders = async () => {
      const result = await getOrdersFromDatabase();
      if (result) {
        setOrders(result);
        console.log("Orders:", orders);
      }
    };

    fetchOrders();
  }, []);

  // Handle Save button click to update user information
  const handleSaveClicked = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsSaving(true);
    if (userId) {
      await updateUserInDatabase(userId, {
        fullname: fullName,
        address: address,
      })
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
    return (
      <div className="h-screen grid place-content-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start gap-10">
      <div className="w-full max-w-4xl">
        <h2 className="text-xl font-semibold mb-4">Account</h2>
        {/* Profile Section */}
        <form className="w-full max-w-4xl bg-slate-900/60 border border-slate-700 shadow-lg backdrop-blur rounded-xl px-10 py-8 space-y-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Profile Details
          </h2>

          {/* Full Name */}
          <div className="flex flex-col gap-1 text-white">
            <label htmlFor="fullName" className="font-medium">
              Full Name
            </label>
            <div className="relative">
              <input
                id="fullName"
                type="text"
                className="w-full p-4 bg-slate-800 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <Pencil
                className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400"
                size={16}
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1 text-white">
            <label htmlFor="email" className="font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              disabled
              className="w-full p-4 bg-slate-800 border border-slate-600 rounded-md text-gray-400 cursor-not-allowed"
              value={email}
            />
          </div>

          {/* Address */}
          <div className="flex flex-col gap-1 text-white">
            <label htmlFor="address" className="font-medium">
              Address
            </label>
            <div className="relative">
              <input
                id="address"
                type="text"
                className="w-full p-4 bg-slate-800 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <Pencil
                className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400"
                size={16}
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="flex flex-col gap-1 text-white">
            <label htmlFor="payment" className="font-medium">
              Payment Method
            </label>
            <input
              id="payment"
              type="text"
              disabled
              className="w-full p-4 bg-slate-800 border border-slate-600 rounded-md text-gray-400 cursor-not-allowed"
              value={payment}
            />
          </div>

          {/* Save Button */}
          <div className="text-right">
            <button
              onClick={(e) => handleSaveClicked(e)}
              disabled={isSaving}
              className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md transition-all duration-200"
            >
              {isSaving ? <LoadingSpinner /> : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      {/* Order History Section */}
      <section className="w-full max-w-4xl mt-12">
        <h2 className="text-xl font-semibold mb-4">Order History</h2>

        {orders.length === 0 ? (
          <p className="text-gray-400 italic">
            You haven&apos;t placed any orders yet.
          </p>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <div
                key={index}
                className="bg-slate-800/50 rounded-lg p-6 shadow border border-slate-700"
              >
                <div className="flex justify-between mb-4 text-sm text-slate-400">
                  <span>
                    Status:{" "}
                    <strong className="text-white">{order.status}</strong>
                  </span>
                  <span>
                    Ordered on: {new Date(order.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="space-y-3">
                  {order.products.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <Image
                        src={item.productData?.imageSrc || "/fallback.png"} // fallback in case of undefined
                        alt={item.productData?.name || "Product Image"}
                        width={64}
                        height={64}
                        className="object-cover rounded w-16 h-16"
                        unoptimized // needed if you're using base64 or external data URLs
                      />
                      <div className="flex flex-col">
                        <span className="font-medium text-white">
                          {item.productData?.name}
                        </span>
                        <span className="text-sm text-slate-400">
                          Qty: {item.quantity} × ${item.productData?.price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Account;
