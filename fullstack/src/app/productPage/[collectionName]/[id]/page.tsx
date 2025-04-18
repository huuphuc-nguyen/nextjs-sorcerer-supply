"use client";
import { LoadingSpinner } from '@/components/ui/spinner';
import { ProductCardFull } from "@/components/ProductCard/product-card";
import { getProductDocument  } from '@/lib/firebase/getProduct';
import { DocumentSnapshot, DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useToast } from '@/hooks/use-toast';
//import { useRouter } from 'nextjs-toploader/app';
import { useParams } from 'next/navigation';

interface CartItem {
  productID?: string;
  productData?: DocumentData;
  quantity?: number;
}
export type { CartItem };

export default function ProductPage() {
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [productDocument, setProductDocument] = useState<DocumentSnapshot<DocumentData> | null>(null);
    //const router = useRouter();
    const { toast } = useToast();
    const { collectionName, id } = useParams();
  
    useEffect(() => {
      // Get Firebase authentication
  
      if(id&&collectionName){
      setLoadingProducts(true);
      getProductDocument(collectionName.toString(),id.toString())
        .then(docSnap => {
          setProductDocument(docSnap);
          setLoadingProducts(false);
        });
      }else{
        console.log("Collection:", collectionName);
        console.log("Id:", id);
      }
      }, [id,collectionName]);

    const handleAddToCartClicked = () => {
      toast({
        title: "Item added to cart",
        variant: "success",
        description:`"${productDocument?.data()?.name} has been added to your cart."`,
      });

      const items = localStorage.getItem("cartItems");
      const cartItems = items ? JSON.parse(decodeURIComponent(items)) : [];

      const newItem : CartItem = {
        productID: productDocument?.id,
        productData: productDocument?.data(),
        quantity: 1,
      } 

      console.log("loaded", cartItems);


      if (cartItems.length > 0) {
        const existingItemIndex = cartItems.findIndex((item : CartItem) => item.productID === newItem.productID);
        if (existingItemIndex !== -1) {
          const updateItem = cartItems[existingItemIndex];
          updateItem.quantity = (updateItem.quantity || 0) + 1;
          cartItems[existingItemIndex] = updateItem;
        } else {
          cartItems.push(newItem); // Add new item if it doesn't exist
        }
      } else{
        cartItems.push(newItem);
      }
        console.log("Updated cart items:", cartItems);
        localStorage.setItem("cartItems", encodeURIComponent(JSON.stringify(cartItems)))
    }

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
                <p className="text-2xl font-bold">{productDocument.data()?.name}</p>
                <p className="text-xl text-gray-500">${productDocument.data()?.price}</p>
                {productDocument.data()?.inStock ? (
                  <button
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={handleAddToCartClicked}
                  >
                    Add to Cart
                  </button>
                ) : (
                  <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
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
