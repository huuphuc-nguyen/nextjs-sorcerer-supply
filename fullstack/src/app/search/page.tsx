"use client";

import { useEffect, useState, Suspense } from "react";
import { ProductCard } from "@/components/ProductCard/product-card";
import { LoadingSpinner } from "@/components/ui/spinner";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Product, searchProducts } from "../../lib/firebase/products";
import { useSearchParams } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";

const SearcComponent = () => {
  const [products, setProducts] = useState<Product[] | undefined>(undefined);
  const [filteredProducts, setFilteredProducts] = useState<
    Product[] | undefined
  >(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isShowInStock, setIsShowInStock] = useState(false);

  const searchParams = useSearchParams();

  useEffect(() => {
    const searchQuery = searchParams.get("q") || "";

    setLoading(true);

    searchProducts(searchQuery || "")
      .then((products) => {
        setProducts(products);
        setFilteredProducts(products);
      })
      .catch((error) => {
        setError(true);
        toast({
          title: "Error",
          variant: "destructive",
          description: "There is an error: " + error.message,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchParams]);

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

  return (
    <div>
      <div className="px-4 py-1 border-b border-gray-800 flex justify-end">
        <div className="flex items-center gap-2 mr-4">
          <Checkbox
            id="in-stock"
            checked={isShowInStock}
            onCheckedChange={(checked) => {
              setIsShowInStock(checked === true);
            }}
          ></Checkbox>
          <label htmlFor="in-stock" className="text-white">
            Show In Stock
          </label>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger>Sort by</DropdownMenuTrigger>
          <DropdownMenuContent className="dark">
            <DropdownMenuItem onClick={() => sortPrice()}>
              Price: Low to High
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => sortPrice(true)}>
              Price: High to Low
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="m-4">
        {loading && <LoadingSpinner />}
        {error && <div>An error occured</div>}
        {filteredProducts?.length === 0 && !loading && (
          <span className="text-white">No products found.</span>
        )}
        {!loading &&
          !error &&
          filteredProducts &&
          filteredProducts?.length > 0 && (
            <div className="flex flex-col gap-4">
              <p>Products</p>
              <div className="flex flex-wrap gap-4">
                {filteredProducts?.map((product) => {
                  return (
                    <Link
                      key={product.id}
                      href={`/productPage/${product.collectionName}/${product.id}`}
                    >
                      <ProductCard
                        key={product.id}
                        name={product.name}
                        price={product.price}
                        imageSrc={product.imageSrc}
                      />
                    </Link>
                  );
                })}
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>
                      2
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
      </div>
    </div>
  );
};

export default function Search() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SearcComponent />
    </Suspense>
  );
}
