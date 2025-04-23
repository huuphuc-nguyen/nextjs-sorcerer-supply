"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { AdminOrder, getUserOrderFromDatabase } from "@/lib/firebase/order";
import Image from "next/image";
import Link from "next/link";
import { LoadingSpinner } from "@/components/ui/spinner";

const OrderDetail = () => {
  const { userId, orderId } = useParams();
  const [order, setOrder] = useState<AdminOrder | null>(null);

  useEffect(() => {
    getUserOrderFromDatabase(userId! as string, orderId! as string)
      .then((order: AdminOrder) => {
        setOrder(order);
        console.log("Order fetched successfully:", order);
      })
      .catch((error) => {
        console.error("Error fetching order:", error);
      });
  }, [userId, orderId]);

  return (
    <div>
      {/* Navbar */}
      <nav className="flex justify-between items-center border-b border-gray-800 p-4 mb-6 mt-4">
        <h1 className="text-2xl font-bold">Seller Dashboard</h1>
        <div className="flex gap-4 text-sm font-medium">
          <a href="#" className="hover:underline">
            Dashboard
          </a>
          <Link href="#" className="hover:underline">
            Discounts
          </Link>
          <Link href="/" className="hover:underline">
            Back to Store
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10 text-white">
        {order ? (
          <>
            <h1 className="text-2xl font-bold mb-6">Order Detail</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Left Info */}
  <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-white rounded-xl shadow-xl p-6 space-y-4 transition hover:scale-[1.01] duration-200">
    <h2 className="text-xl font-bold text-emerald-300 flex items-center gap-2">
      📄 Customer Info
    </h2>
    <div className="space-y-1 text-sm leading-relaxed">
      <p><span className="font-semibold text-emerald-400">Order ID:</span> {order.id}</p>
      <p><span className="font-semibold text-emerald-400">Status:</span> {order.status}</p>
      <p><span className="font-semibold text-emerald-400">Customer:</span> {order.customerFullname}</p>
      <p><span className="font-semibold text-emerald-400">Email:</span> {order.customerEmail}</p>
      <p><span className="font-semibold text-emerald-400">Created At:</span> {new Date(order.createdAt).toLocaleString()}</p>
      <p><span className="font-semibold text-emerald-400">Total:</span> ${order.total.toFixed(2)}</p>
    </div>
  </div>

  {/* Shipping Address */}
  <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-white rounded-xl shadow-xl p-6 space-y-4 transition hover:scale-[1.01] duration-200">
    <h2 className="text-xl font-bold text-emerald-300 flex items-center gap-2">
      🚚 Shipping Address
    </h2>
    <div className="space-y-1 text-sm leading-relaxed">
      <p><span className="font-semibold text-emerald-400">Full Name:</span> {order.fullName}</p>
      <p><span className="font-semibold text-emerald-400">Email:</span> {order.email}</p>
      <p><span className="font-semibold text-emerald-400">Address:</span> {order.address || "N/A"}</p>
      <p><span className="font-semibold text-emerald-400">City:</span> {order.city || "N/A"}</p>
      <p><span className="font-semibold text-emerald-400">State:</span> {order.state || "N/A"}</p>
      <p><span className="font-semibold text-emerald-400">Zip:</span> {order.zip || "N/A"}</p>
    </div>
  </div>
</div>

            <h2 className="text-xl font-semibold mt-8 mb-4">Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {order.products.map((product, index) => (
                <div
                  key={index}
                  className="bg-zinc-900 border border-white rounded-lg p-4 shadow"
                >
                  <div className="w-full mb-2 h-[200px] grid place-items-center overflow-hidden">
                    <Image
                      src={
                        product.productData?.imageSrc ||
                        "/avatar_placeholder.png"
                      }
                      alt={product.productData?.name || "Product image"}
                      width={200}
                      height={200}
                      className="object-cover rounded mb-2 mx-auto"
                    />
                  </div>
                  <h3 className="text-lg font-semibold">
                    {product.productData?.name || "Unknown Product"}
                  </h3>
                  <p className="text-emerald-300 text-sm mb-2">
                    {product.productData?.description?.split("\n")[0] ||
                      "No description available"}
                  </p>
                  <p>
                    <strong>Price:</strong> $
                    {product.productData?.price || "N/A"}
                  </p>
                  <p>
                    <strong>Quantity:</strong> {product.quantity}
                  </p>
                  <p>
                    <strong>Subtotal:</strong> $
                    {(
                      (product.productData?.price ?? 0) *
                      (product.quantity ?? 0)
                    ).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <LoadingSpinner className="w-full block mx-auto mt-10" />
        )}
      </div>
    </div>
  );
};

export default OrderDetail;
