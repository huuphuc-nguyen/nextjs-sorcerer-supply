"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'nextjs-toploader/app';

import { auth } from '@/lib/firebase/config'
import { LoadingSpinner } from '@/components/ui/spinner';

import OrderCard from "@/components/OrderCard/order-card";

const Account = () => {

    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const profile = { fullName: "John Doe", address: "123 Main St", paymentMethod: "Credit Card" };
    const user = { email: "johndoe@gmail.com" };

    const orders = [
        {
        id: 1,
        imageSrc: "https://img.freepik.com/premium-photo/whimsical-toad-magical-forest_1016686-121478.jpg?semt=ais_hybrid",
        name: "Crazy Frog",
        price: 12.9,
        quantity: 2
        },
    ]
    

    useEffect(() => {
        // Get Firebase authentication
        auth.onAuthStateChanged(user => {
            console.log(user);
            if (!user) {
                sessionStorage.setItem("redirectAfterLogin", "/account");
                router.push('/login');
            }
            else {
                setLoading(false);
            }
        });

      }, [router]);

    if (loading) {
        return <div className="h-screen grid place-content-center"><LoadingSpinner /></div>;
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-start gap-10 p-16">
            <h1 className="text-2xl font-semibold">Account</h1>
                {/* Profile Section */}
                <div className="border border-dashed rounded-xl px-16 py-6 w-1/2 grid place-items-center">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
                        <div className="text-md flex items-center">
                            <strong>Full Name:</strong>
                        </div>
                        <div className="text-md border rounded-md p-4">
                            {profile?.fullName || "N/A"}
                        </div>
                        
                        <div className="text-md">
                            <strong>Email:</strong>
                        </div>
                        <div className="text-md border rounded-md p-4">
                           {user?.email}
                        </div>

                        <div className="text-md">
                            <strong>Address:</strong>
                        </div>
                        <div className="text-md border rounded-md p-4">
                            {profile?.address || "Not provided"}
                        </div>

                        <div className="text-md">
                            <strong>Payment Method:</strong>
                        </div>
                        <div className="text-md border rounded-md p-4">
                           {profile?.paymentMethod || "Not added"}
                        </div>
                    </div>
                </div>

                {/* Orders Section */}
                <div className="border rounded-xl px-16 py-6 w-80">
                    <h2 className="text-xl font-semibold">Your Orders</h2>
                    <div className="mt-4">
                        {orders.length === 0 ? (
                            <p>No orders found.</p>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order) => (
                                    <OrderCard key={order.id} order={order} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
        </main>
    );
};

export default Account
