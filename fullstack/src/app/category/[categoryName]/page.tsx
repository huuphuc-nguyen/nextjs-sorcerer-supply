"use client";

import React, { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Product } from "@/lib/firebase/products";
import { useRouter } from "nextjs-toploader/app";
import { ProductCard } from "@/components/ProductCard/product-card";
import { getCategory } from "@/lib/firebase/getCategory";
import { useParams } from "next/navigation";

const CategoryPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();
  const { categoryName } = useParams();

  // Fetch products when collectionName changes
  useEffect(() => {
    if (!categoryName) {
      console.error("Collection name is undefined");
      setLoading(false);
      return;
    }

    // Fetch products from Firestore using getCategory()
    const fetchProducts = async () => {
      try {
        const collection = categoryName.toString(); // Ensure collectionName is a string
        const productsData = await getCategory(collection);

        // Map the data correctly to the Product interface if needed
        const mappedProducts: Product[] = productsData.map((product) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          imageSrc: product.imageSrc,
          collectionName: product.collectionName || collection,
          
        }));

        setProducts(mappedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName]);

  // Show loading spinner while fetching
  if (loading) {
    return <LoadingSpinner className="w-full block mx-auto" />;
  }

  // Show message if no products found
  if (!products || products.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-8">
        No products found in this category.
      </div>
    );
  }

  return (
    <div className="p-[2rem] grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-10 place-items-center">
      {products.map((product) => (
        <div
          key={product.id}
          onClick={() =>
            router.push(`/productPage/${product.collectionName}/${product.id}`)
          }
          style={{ cursor: "pointer" }}
        >
          <ProductCard
            name={product.name}
            price={product.price}
            imageSrc={product.imageSrc}
          />
        </div>
      ))}
    </div>
  );
};

export default CategoryPage;
