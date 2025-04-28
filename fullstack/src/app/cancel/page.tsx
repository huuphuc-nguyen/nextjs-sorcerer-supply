"use client";
import { removeOrderFromDatabase } from "@/lib/firebase/order";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "@/hooks/use-toast";

export default function CancelPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  removeOrderFromDatabase(orderId!);
  toast({
    title: "Order Canceled",
    description: "Your order has been successfully canceled.",
    variant: "destructive",
  });

  return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-8">
        <h1 className="text-4xl font-bold mb-4">🧙‍♂️ Payment Canceled</h1>
        <p className="text-lg text-gray-300 mb-8">
          The mystical transaction was interrupted.
        </p>
        <Link
          href="/"
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition"
        >
          Return to Spellbook
        </Link>
      </div>
    );
  }
  