'use client';

import { useEffect, useState } from "react";
import { useHeader } from "@/hooks/use-header";
import { SiteHeader } from "@/components/SiteHeader/site-header";
import { ProductCard } from "@/components/ProductCard/product-card";
import { LoadingSpinner } from "@/components/ui/spinner";
import { CartSheet } from "@/components/CartSheet/cart-sheet";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { getProducts, Product, searchProducts } from "../../lib/firebase/products";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";

export default function Search() {

    const [products, setProducts] = useState<Product[] | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const {
        handleAuthClicked,
        handleCartClicked,
        handleAccountClicked,
        handleSearchClicked,
        authenticated,
        cartOpen,
        setSearchText,
        setCartOpen
    } = useHeader();

    const searchParams = useSearchParams();

    useEffect(() => {
        const searchQuery = searchParams.get('q') || '';

        setLoading(true);

        searchProducts(searchQuery || '').then(products => {
            setProducts(products)
        }).catch(_ => {
            setError(true);
        }).finally(() => {
            setLoading(false);
        });
    }, [searchParams]);

    return (
        <div>
            <SiteHeader setSearchText={setSearchText} onCartClicked={handleCartClicked} onSearchClicked={handleSearchClicked} />
            <div className="m-4">
                {loading && <LoadingSpinner />}
                {error && <div>An error occured</div>}
                {!loading && !error && products &&
                    <div className="flex flex-col gap-4">
                        <p>Products</p>
                        <div className="flex flex-wrap gap-4">
                            {products.map(product => { return <ProductCard key={product.id} name={product.name} price={product.price} imageSrc={product.imageSrc} /> })}
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
            <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
        </div>
    );
}