"use client";

import React, { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Product } from "@/lib/firebase/products";
import { useRouter } from "nextjs-toploader/app";
import { ProductCard } from "@/components/ProductCard/product-card";
import { getCategory } from "@/lib/firebase/getCategory";
import { useParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";


const CategoryPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();
  const [isShowInStock, setIsShowInStock] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<    Product[] | undefined
  >(undefined);
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
          inStock: product.inStock,
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

  useEffect(() => {
    if (products) {
      if (isShowInStock) {
        const filtered = products.filter((product) => product.inStock);
        setFilteredProducts(filtered);
      } else {
        setFilteredProducts(products);
      }
    }
  }, [isShowInStock, products]);

  function sortPrice(desc = false) {
    setFilteredProducts((prevProducts) => {
      if (prevProducts) {
        const sortedProducts = [...prevProducts].sort((a, b) => {
          return desc ? b.price - a.price : a.price - b.price;
        });
        return sortedProducts;
      }
    });
  }

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
    <div className="p-8">
      {/* ─── Filter + sort bar ─────────────────────────────── */}
      <div className="mb-6 flex justify-end items-center gap-4">
        {/* “Show In Stock” checkbox */}
        <div className="flex items-center gap-2">
          <Checkbox
            id="in-stock"
            checked={isShowInStock}
            onCheckedChange={(checked) => {
              setIsShowInStock(checked === true);
            }}
          />
          <label htmlFor="in-stock" className="text-white">
            Show In Stock
          </label>
        </div>
  
        {/* Sort-by dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger>Sort by</DropdownMenuTrigger>
          <DropdownMenuContent className="dark">
            <DropdownMenuItem onClick={() => sortPrice(false)}>
              Price: Low to High
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => sortPrice(true)}>
              Price: High to Low
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
  
      {/* ─── Product grid ──────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-10 place-items-center">
        {(filteredProducts ?? products).map((p) => (
          <div
            key={p.id}
            onClick={() => router.push(`/productPage/${p.collectionName}/${p.id}`)}
            className="cursor-pointer"
          >
            <ProductCard name={p.name} price={p.price} imageSrc={p.imageSrc} />
          </div>
        ))}
      </div>
    </div>
  );
  
};

export default CategoryPage;
