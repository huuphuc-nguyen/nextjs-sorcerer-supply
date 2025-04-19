"use client";
import { LoadingSpinner } from "@/components/ui/spinner";
import { ProductCardFull } from "@/components/ProductCard/product-card";
import { getProductDocument } from "@/lib/firebase/getProduct";
import { DocumentSnapshot, DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";
import { Input } from "postcss";
import { updateProductQuantity,updateProductName,updateProductPrice,updateProductDescription,deleteProductFromDatabase } from "@/lib/firebase/products";
import { wrap } from "module";
import { useRouter } from "next/navigation";




export default function modifyItems() {
  const router = useRouter();
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productDocument, setProductDocument] =
    useState<DocumentSnapshot<DocumentData> | null>(null);
  const { toast } = useToast();
  const { collectionName, id } = useParams();
  const [quantity, setQuantity] = useState(productDocument?.data()?.quantity || 0);
  const [price, setPrice] = useState(productDocument?.data()?.price || 0);
  const [name, setName] = useState(productDocument?.data()?.name || ""); 
  const [description, setDescription] = useState<string>(
    productDocument?.data()?.description || ""
  )
  const handleDelete = async () => {
       if (!window.confirm("Are you sure you want to delete this product?")) return;
       try {
         await deleteProductFromDatabase(
           collectionName!.toString(),
           id!.toString()
         );
         toast({ title: "Deleted", description: "Product removed.", variant: "default" });
         router.push("/sellerDashboard");
       } catch (e) {
         console.error(e);
         toast({ title: "Error", description: "Could not delete.", variant: "destructive" });
       }
     };

  useEffect(() => {
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
      window.location.href = "/"; 
    }
  }, [id, collectionName, toast]);

  

  return (
    <div>
      {/* Rest of your product page content */}
      <nav className="flex justify-between items-center border-b border-gray-800 pb-4 mb-6">
                <h1 className="text-2xl font-bold">Seller Dashboard</h1>
                <div className="flex gap-4 text-sm font-medium">
                    <a href="/sellerDashboard" className="hover:underline">Dashboard</a>
                    <a href="#" className="hover:underline">Discounts</a>
                    <a href="/" className="hover:underline">Back to Store</a>
                </div>
            </nav>

      <div className="px-4 py-2">
        <p>Modify Product</p>
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
              <div className="p-4 rounded shadow-sm">
                <p className="text-md">
                  <span className="font-bold">Description:</span>
                  <textarea
                    defaultValue={productDocument.data()?.description}
                    onChange={e => setDescription(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault()   // prevent newline if you only want Enter to save
                        if (description.trim() === '') {
                          toast({
                            title: "Error",
                            description: "Description cannot be empty.",
                            variant: "destructive",
                          })
                          return
                        }
                        updateProductDescription(
                          collectionName!.toString(),
                          id!.toString(),
                          description.trim()
                        )
                        toast({
                          title: "Success",
                          description: "Description updated successfully.",
                        })
                        window.location.reload()
                      }
                    }}
                    rows={4}
                    className="bg-black text-white p-2 rounded w-full h-32 resize-y"
                  />
                </p>
              </div>
              <div className="p-4 rounded shadow-sm">
                  <p className="text-md">
                    <span className="font-bold">Quantity:</span>
                    {
                      <input
                        defaultValue={productDocument.data()?.quantity}
                        onChange={(e) => {
                          setQuantity(parseInt(e.target.value));
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            if (isNaN(quantity)) {
                              toast({ title: "Error", description: "Quantity cannot be empty.", variant: "destructive" });
                              return;
                            }
                            updateProductQuantity(
                            collectionName!.toString(),
                              id!.toString(),
                              quantity
                            );
                            toast({
                              title: "Success",
                              description: "Product quantity updated successfully.",
                            });
                            window.location.reload();
                          }
                        }}
                        className="bg-black text-white p-2 rounded"
                      />
                    }
                  </p>
                </div>
              <div className="p-4 rounded shadow-sm">
                    <p className="text-md">
                      <span className="font-bold">Name:</span>
                      <input
                      style={{width: "60%"}}
                       defaultValue={productDocument.data()?.name}
                        onChange={e => setName(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            if (name.trim() === '') {
                              toast({ title: "Error", description: "Name cannot be empty.", variant: "destructive" });
                              return;
                            }
                            updateProductName(
                              collectionName!.toString(),
                              id!.toString(),
                              name.trim()
                            );
                            toast({ title: "Success", description: "Name updated.", });
                            window.location.reload();
                          }
                        }}
                        className="bg-black text-white p-2 rounded w-full"
                      />
                    </p>
                  </div>
                  <div className="p-4 rounded shadow-sm">
                    <p className="text-md">
                      <span className="font-bold">Price:</span>
                      <input
                        type="number"
                        defaultValue={productDocument.data()?.price}
                        onChange={e => setPrice(parseFloat(e.target.value))}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            if (isNaN(price)) {
                              toast({ title: "Error", description: "Price cannot be empty.", variant: "destructive" });
                              return;
                            }
                            updateProductPrice(
                              collectionName!.toString(),
                              id!.toString(),
                              price
                            );
                            toast({ title: "Success", description: "Price updated.", });
                            window.location.reload();
                          }
                        }}
                        className="bg-black text-white p-2 rounded w-24"
                      />
                    </p>
                  </div>
                  {/* ← Add your Delete button here */}
                  <div className="w-full flex justify-center mt-4">
                    <button
                      onClick={handleDelete}
                      style={{ width: "50%", height: "50px",marginTop: "10%" }}
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition"
                    >
                      Delete Product
                    </button>
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
