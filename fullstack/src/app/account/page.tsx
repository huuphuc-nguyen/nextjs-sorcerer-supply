"use client";

import { FormEventHandler, useEffect, useState } from "react";
import { useRouter } from 'nextjs-toploader/app';

import { auth } from '@/lib/firebase/config'
import { LoadingSpinner } from '@/components/ui/spinner';
import { Pencil } from "lucide-react";
import { getUserFromDatabase, updateUserInDatabase } from "@/lib/firebase/users";
import { toast } from "@/hooks/use-toast";

const Account = () => {

    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [fullName, setFullName] = useState<string>(sessionStorage.getItem("userFullname") || "");
    const [address, setAddress] = useState<string>(sessionStorage.getItem("userAddress") || "");
    const [email] = useState<string>(sessionStorage.getItem("userEmail") || "");
    const [userId] = useState<string>(sessionStorage.getItem("userId") || "");  
    const [payment] = useState<string>(sessionStorage.getItem("userPayment") || "");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        // Get Firebase authentication
        auth.onAuthStateChanged(user => {
            if (!user) {
                sessionStorage.setItem("redirectAfterLogin", "/account");
                router.push('/login');
            }
            else {
                setLoading(false);
                getUserFromDatabase(user.uid).then((userData) => {
                    if (userData) {
                        sessionStorage.setItem("userId", user.uid);
                        sessionStorage.setItem("userEmail", userData.email);
                        sessionStorage.setItem("userPayment", userData.payment);
                        sessionStorage.setItem("userAddress", userData.address);
                        sessionStorage.setItem("userFullname", userData.fullname);
                    }
                }
                ).catch((error) => {
                    console.error("Error getting user data:", error);
                }
                );
            }
        });

      }, [router]);


    const handleSaveClicked : FormEventHandler<HTMLFormElement> = async (e) => {
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
            });}
            )
            .catch((error) => {
                setIsSaving(false);
                toast({
                    title: "Changes saved",
                    variant: "destructive",
                    description: `Error saving user data: ${error}`});
                console.error("Error saving user data:", error);
            }
            );
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
                                onChange={(e) => setFullName(e.target.value)}
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
                                onChange={(e) => setAddress(e.target.value)}
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

                    <button className="my-10 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700" onClick={(e) => handleSaveClicked(e)} disabled={isSaving}>
                        {isSaving? <LoadingSpinner/> : "Save Changes"}
                    </button>
                </form>
        </main>
    );
};

export default Account
