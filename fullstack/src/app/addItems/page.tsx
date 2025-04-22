"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { ProductCardFull } from "@/components/ProductCard/product-card";
import { addProductToDatabase } from "@/lib/firebase/products";
import placeholderImage from "./assets/placeholderImage.png";
import Link from "next/link";

export default function AddItemPage() {
  const router = useRouter();
  const { toast } = useToast();

  // mirror your modifyItems state shape, but empty
  const [collectionName, setCollectionName] = useState("wands"); // or let them choose
  const [imageSrc, setImageSrc] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">(0);
  const [quantity, setQuantity] = useState<number | "">(0);
  const [description, setDescription] = useState("");

  const allFilled =
    collectionName &&
    imageSrc.trim() &&
    name.trim() &&
    description.trim() &&
    price !== "" &&
    quantity !== "";
  const onSave = async () => {
    if (
      !collectionName ||
      !imageSrc.trim() ||
      !name.trim() ||
      price === "" ||
      quantity === "" ||
      !description.trim()
    ) {
      toast({
        title: "Error",
        description: "Please fill out every field before saving.",
        variant: "destructive",
      });
      return;
    }

    try {
      await addProductToDatabase(collectionName, {
        name: name.trim(),
        price: Number(price),
        quantity: Number(quantity),
        description: description.trim(),
        imageSrc: imageSrc.trim(),
      });
      toast({
        title: "Success",
        description: "Product added!",
        variant: "success",
      });
      router.push("/sellerDashboard");
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: "Could not add item.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-black text-white px-6 py-4 min-h-fit">
      {/* reuse your nav */}
      <nav className="flex justify-between items-center border-b border-gray-800 pb-4 mb-6">
        <h1 className="text-2xl font-bold">Sorceres Supply</h1>
        <div className="flex gap-4 text-sm font-medium">
          <Link href="/sellerDashboard" className="hover:underline">
            Dashboard
          </Link>
          <Link href="#" className="hover:underline">
            Discounts
          </Link>
          <Link href="/" className="hover:underline">
            Back to Store
          </Link>
        </div>
      </nav>

      <div className="p-[2rem] flex justify-center gap-20">
        {/* Left: Preview Card */}
        <div className="w-full md:w-1/2">
          <ProductCardFull
            name={name}
            price={price ? Number(price) : 0}
            imageSrc={imageSrc || placeholderImage.src}
          />
        </div>

        {/* Right: Form */}
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          {/* Collection selector (optional) */}
          <div className="p-4 rounded shadow-sm">
            <label className="block font-bold mb-1">Category</label>
            <select
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              className="bg-black text-white p-2 rounded w-full border border-zinc-600"
            >
              {[
                "wands",
                "spellBooks",
                "staffs",
                "scrolls",
                "magicItems",
                "ingredients",
                "cursedItems",
                "creatures",
              ].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="p-4 rounded shadow-sm">
            <label className="block font-bold mb-1">Image URL</label>
            <input
              value={imageSrc}
              onChange={(e) => setImageSrc(e.target.value)}
              placeholder="https://..."
              className="bg-black text-white p-2 rounded w-full border border-zinc-600"
            />
          </div>

          <div className="p-4 rounded shadow-sm">
            <label className="block font-bold mb-1">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Product name"
              className="bg-black text-white p-2 rounded w-full border border-zinc-600"
            />
          </div>

          <div className="p-4 rounded shadow-sm flex gap-4">
            <div className="flex-1">
              <label className="block font-bold mb-1">Price</label>
              <input
                type="number"
                value={price}
                onChange={(e) =>
                  setPrice(
                    e.target.value === "" ? "" : parseFloat(e.target.value),
                  )
                }
                placeholder="0.00"
                className="bg-black text-white p-2 rounded w-full border border-zinc-600"
              />
            </div>
            <div className="flex-1">
              <label className="block font-bold mb-1">Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) =>
                  setQuantity(
                    e.target.value === "" ? "" : parseInt(e.target.value),
                  )
                }
                placeholder="0"
                className="bg-black text-white p-2 rounded w-full border border-zinc-600"
              />
            </div>
          </div>

          <div className="p-4 rounded shadow-sm">
            <label className="block font-bold mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter product description…"
              rows={4}
              className="bg-black text-white p-2 rounded w-full resize-y border border-zinc-600"
            />
          </div>

          {/* Save button */}
          <div className="flex justify-center">
            <button
              onClick={onSave}
              disabled={!allFilled}
              className={`
                bg-green-600 hover:bg-green-700 
                font-semibold py-3 px-8 rounded-2xl shadow-md 
                transition duration-200
                ${!allFilled && "opacity-50 cursor-not-allowed"}
            `}
            >
              Save Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
