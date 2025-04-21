"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DocumentSnapshot, DocumentData } from "firebase/firestore";

import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/spinner";
import { ProductCardFull } from "@/components/ProductCard/product-card";
import { getProductDocument } from "@/lib/firebase/getProduct";
import {
  updateProductDescription,
  updateProductName,
  updateProductPrice,
  updateProductQuantity,
} from "@/lib/firebase/products";
import Link from "next/link";

export default function ModifyItems() {
  const { toast } = useToast();
  const { collectionName, id } = useParams();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<DocumentSnapshot<DocumentData> | null>(
    null
  );

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!collectionName || !id) {
      toast({
        title: "Error",
        description: "Product not found.",
        variant: "destructive",
      });
      window.location.href = "/";
      return;
    }

    setLoading(true);
    getProductDocument(collectionName.toString(), id.toString()).then(
      (docSnap) => {
        if (docSnap.exists()) {
          setProduct(docSnap);
          const data = docSnap.data();
          setName(data.name);
          setPrice(data.price);
          setQuantity(data.quantity);
          setDescription(data.description);
        }
        setLoading(false);
      }
    );
  }, [collectionName, id, toast]);

  const handleUpdate = async (field: string, value: any) => {
    if (!collectionName || !id) return;

    const updateMap: Record<string, Function> = {
      name: updateProductName,
      price: updateProductPrice,
      quantity: updateProductQuantity,
      description: updateProductDescription,
    };

    try {
      await updateMap[field](collectionName.toString(), id.toString(), value);
      toast({
        title: "Success",
        description: `${field} updated successfully.`,
        variant: "success",
      });
    } catch {
      toast({
        title: "Error",
        description: `Failed to update ${field}.`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="px-6 py-4">
      <nav className="flex justify-between items-center border-b border-gray-800 pb-4 mb-6">
        <h1 className="text-2xl font-bold">Seller Dashboard</h1>
        <div className="flex gap-4 text-sm font-medium">
          <Link href="/sellerDashboard" className="hover:underline">
            Dashboard
          </Link>
          <Link href="/discounts" className="hover:underline">
            Discounts
          </Link>
          <Link href="/" className="hover:underline">
            Back to Store
          </Link>
        </div>
      </nav>

      <h2 className="text-xl font-semibold mb-4">Modify Product</h2>

      <div className="flex flex-col lg:flex-row gap-10">
        {loading || !product ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="lg:w-1/2">
              <ProductCardFull
                name={name}
                price={price}
                imageSrc={product.data()?.imageSrc}
              />
            </div>

            <div className="lg:w-1/2 space-y-6">
              <FieldBlock label="Name">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleUpdate("name", name.trim())
                  }
                  className="bg-zinc-900 text-white p-2 rounded w-full"
                />
              </FieldBlock>

              <FieldBlock label="Price">
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value))}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleUpdate("price", price)
                  }
                  className="bg-zinc-900 text-white p-2 rounded w-32"
                />
              </FieldBlock>

              <FieldBlock label="Quantity">
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleUpdate("quantity", quantity)
                  }
                  className="bg-zinc-900 text-white p-2 rounded w-32"
                />
              </FieldBlock>

              <FieldBlock label="Description">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleUpdate("description", description.trim());
                    }
                  }}
                  rows={10}
                  className="bg-zinc-900 text-white p-2 rounded w-full resize-y"
                />
              </FieldBlock>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function FieldBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-2 text-zinc-500">{label}:</label>
      {children}
    </div>
  );
}
