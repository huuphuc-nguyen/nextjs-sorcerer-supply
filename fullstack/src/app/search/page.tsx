'use client';

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
} from "@/components/ui/pagination"
import { Product, searchProducts } from "../../lib/firebase/products";
import { useSearchParams } from "next/navigation";
import {toast} from "@/hooks/use-toast";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import Link from 'next/link';
  

const SearcComponent = () => {
    const [products, setProducts] = useState<Product[] | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const searchParams = useSearchParams();

    useEffect(() => {
        const searchQuery = searchParams.get('q') || '';

        setLoading(true);

        searchProducts(searchQuery || '').then(products => {
            setProducts(products)
        }).catch(error => {
            setError(true);
            toast({
                title: "Error",
                variant: "destructive",
                description: "There is an error: " + error.message, 
              });
        }).finally(() => {
            setLoading(false);
        });
    }, [searchParams]);
    function sortPrice(desc = false) {
        let sorted;
        if (desc) {
          sorted = products?.toSorted((a, b) => {return b.price - a.price});
        } else {
          sorted = products?.toSorted((a, b) => {return a.price - b.price});
        }
        setProducts(sorted);
    }

    return (
        <div>
            <div className="px-4 py-1 border-b border-gray-800 flex justify-end">
         <DropdownMenu>
           <DropdownMenuTrigger>Sort by</DropdownMenuTrigger>
           <DropdownMenuContent className="dark">
             <DropdownMenuItem onClick={() => sortPrice()}>Price: Low to High</DropdownMenuItem>
             <DropdownMenuItem onClick={() => sortPrice(true)}>Price: High to Low</DropdownMenuItem>
             <DropdownMenuItem>In Stock</DropdownMenuItem>
           </DropdownMenuContent>
         </DropdownMenu>
       </div>
            <div className="m-4">
                {loading && <LoadingSpinner />}
                {error && <div>An error occured</div>}
                {!loading && !error && products &&
                    <div className="flex flex-col gap-4">
                        <p>Products</p>
                        <div className="flex flex-wrap gap-4">
                            {products.map(product => { return (
                            <Link key={product.id} href={`/productPage/${product.collectionName}/${product.id}`}>
                                <ProductCard key={product.id} name={product.name} price={product.price} imageSrc={product.imageSrc} /> 
                            </Link>)})}
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
                }
            </div>
        </div>
    );
}

export default function Search() {
    return (
   <Suspense fallback={<LoadingSpinner />}>
        <SearcComponent />
    </Suspense>
    );
}