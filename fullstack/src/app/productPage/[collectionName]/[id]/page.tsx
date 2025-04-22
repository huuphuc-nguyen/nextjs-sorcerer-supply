"use client";
import { LoadingSpinner } from "@/components/ui/spinner";
import { ProductCardFull } from "@/components/ProductCard/product-card";
import { getProductDocument } from "@/lib/firebase/getProduct";
import { DocumentSnapshot, DocumentData, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";
import { updateProductQuantity } from "@/lib/firebase/products";
import { useCartContext } from "@/context/cartContext";

interface CartItem {
  productID?: string;
  productData?: DocumentData;
  quantity?: number;
}
export type { CartItem };

export default function ProductPage() {
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productDocument, setProductDocument] =
    useState<DocumentSnapshot<DocumentData> | null>(null);
  const { toast } = useToast();
  const { collectionName, id } = useParams();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // use trigger to force re-render to update sotck quantity when cart changes
  const {trigger} = useCartContext();

  useEffect(() => {
    // Get Firebase authentication

    if (id && collectionName) {
      setLoadingProducts(true);
      getProductDocument(collectionName.toString(), id.toString()).then(
        (docSnap) => {
          setProductDocument(docSnap);
          setLoadingProducts(false);
        }
      );
    } else {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Product not found.",
      });
      window.location.href = "/"; // Redirect to products page
    }
  }, [id, collectionName, toast, trigger]);

  const handleOutOfStockClicked = () => {      
    toast({
    title: "Out of Stock",
    variant: "destructive",
    description: "This item is currently out of stock.",
  });}

  const handleAddToCartClicked = async () => {
    if (isAddingToCart) return; // 🔒 Prevent spam click
    setIsAddingToCart(true);
  
    try {
      const latestDoc = await getProductDocument(collectionName?.toString() ?? "", id?.toString() ?? "");
      const currentQty = latestDoc.data()?.quantity;
  
      if (!latestDoc.data()?.inStock || currentQty <= 0) {
        toast({
          title: "Out of Stock",
          variant: "destructive",
          description: "This item is currently out of stock.",
        });
        return;
      }
  
      await updateProductQuantity(
        collectionName?.toString() ?? "",
        id?.toString() ?? "",
        currentQty - 1
      );
  
      // Proceed to update localStorage here...
      // Use latestDoc instead of stale productDocument
      const items = localStorage.getItem("cartItems");
      const cartItems = items ? JSON.parse(decodeURIComponent(items)) : [];
  
      const newItem: CartItem = {
        productID: latestDoc.id,
        productData: latestDoc.data(),
        quantity: 1,
      };
  
      const existingItemIndex = cartItems.findIndex(
        (item: CartItem) => item.productID === newItem.productID
      );
  
      if (existingItemIndex !== -1) {
        cartItems[existingItemIndex].quantity += 1;
      } else {
        cartItems.push(newItem);
      }
  
      localStorage.setItem("cartItems", encodeURIComponent(JSON.stringify(cartItems)));
  
      toast({
        title: "Item added to cart",
        variant: "success",
        description: `${latestDoc.data()?.name} has been added to your cart.`,
      });
  
      // Refresh product state
      getProductDocument(collectionName?.toString() ?? "", id?.toString() ?? "").then(
        (docSnap) => {
        setProductDocument(docSnap);
      }
      );
  
    } catch (error) {
      const err = error as Error;
      toast({
        title: "Error",
        variant: "destructive",
        description: "Failed to add item to cart: " + err.message,
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div>
      {/* Rest of your product page content */}
      <div className="px-4 py-2">
        <p>Product Page</p>
      </div>
      <div className="max-h-[80vh] p-[2rem] flex justify-center gap-20">
        {loadingProducts ? (
          <LoadingSpinner />
        ) : productDocument ? (
          <>
            {/* Left: Product Image */}
            <div className="max-h-[80vh] w-full md:w-1/2 lg:w-1/2 xl:w-1/2 h-full md:h-1/2 lg:h-1/2 xl:h-1/2">
              <ProductCardFull
                key={productDocument.id}
                name={productDocument.data()?.name}
                price={productDocument.data()?.price}
                imageSrc={productDocument.data()?.imageSrc}
              />
            </div>
            {/* Right: Product Details */}
            <div className="max-h-[80vh] w-full md:w-1/2 lg:w-1/2 xl:w-1/2 min-h-full flex flex-col gap-6">
              {/* Description Section */}
              <div className=" p-4 rounded shadow-sm">
                <p className="text-md ">
                  {productDocument.data()?.description}
                </p>
              </div>
              <div className=" p-4 rounded shadow-sm">
                <p className="text-md ">
                  {(productDocument.data()?.quantity > 0) ? "In stock: " + productDocument.data()?.quantity : "Out of stock."}
                </p>
              </div>
              {/* Name, Price, Button Section */}
              <div className="flex flex-col justify-end">
                <p className="text-2xl font-bold">
                  {productDocument.data()?.name}
                </p>
                <p className="text-xl text-gray-500">
                  ${productDocument.data()?.price}
                </p>
                {productDocument.data()?.inStock ? (
                  <button
                    className=" relative mt-6 bg-black text-white px-4 py-2 rounded group transition-all duration-500 hover:text-black"
                    onClick={handleAddToCartClicked}
                    disabled={isAddingToCart}
                  >
                    <span className="relative z-10">
                      {isAddingToCart ? (
                       <LoadingSpinner className="text-center w-full"/> // Loading spinner
                      ) : (
                        "Add to Cart"
                      )}
                    </span>
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-0 bg-white group-hover:w-full transition-all duration-500"></span>
                  </button>
                ) : (
                  <button 
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={handleOutOfStockClicked}>
                    Out of Stock
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          <LoadingSpinner />
        )}
      </div>
    </div>
  );
}
