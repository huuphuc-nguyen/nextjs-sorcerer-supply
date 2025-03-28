"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'nextjs-toploader/app';
import { getProducts, Product } from '@/lib/firebase/products';
import { LoadingSpinner } from '@/components/ui/spinner';
import { SiteHeader } from "@/components/SiteHeader/site-header";
import { ProductCard } from "@/components/ProductCard/product-card";
import { CartSheet } from '@/components/CartSheet/cart-sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Image from "next/image";
import { useHeader } from "@/hooks/use-header";

export default function Home() {

  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [products, setProducts] = useState<Product[]>();

  const {
    handleAuthClicked,
    handleCartClicked,
    handleAccountClicked,
    handleSearchClicked,
    authenticated,
    cartOpen,
    setSearchText,
    setCartOpen,} = useHeader();
  
  useEffect(() => {
    // Get products from Firestore
    getProducts()
      .then(products => setProducts(products))
      .catch(error => { setError(true); console.error(error) })
      .finally(() => { setLoading(false) });
  }, []);

  const images = [
    '/depositphotos_227387246-stock-photo-photo-of-three-witches-with.jpg',
    '/gettyimages-175543914-612x612.jpg',
    '/gettyimages-1186887201-612x612.jpg'
  ];
  const categories = [
    "Beginner",
    "More Categories"
  ];
  
  return (
    <div>
      <SiteHeader authenticated={authenticated} setSearchText={setSearchText} onSearchClicked={handleSearchClicked} onAuthClicked={handleAuthClicked} onCartClicked={handleCartClicked} onAccountClicked={handleAccountClicked}/>
      
      {/* Code From Chris */}

      <div className='flex justify-center'>
        <Carousel className='w-full max-w-xl' id="hero-carousel" opts={{
          loop: true
        }}>
          <CarouselContent>
            {images.map((value, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex items-center justify-center">
                      <Image
                          src={value}
                          alt="Image"
                          height={500}
                          width={500}/>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      <div className="px-4 py-2">
        <h1>Collections</h1>
      </div>

      <div className='flex justify-center w-full px-[10%]'>
        <Carousel className='w-full'>
          <CarouselContent>
            {categories.map((value, index) => (
              <CarouselItem className='basis-1/5' key={index}>
                <Card className='h-36 flex'>
                  <CardContent>
                    <p>{value}</p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselNext />
          <CarouselPrevious />
        </Carousel>
      </div>
      <div className="px-4 py-2">
        <h1>Featured</h1>
      </div>

      <div className='flex justify-center w-full px-[10%]'>
        <Carousel className='w-full'>
          <CarouselContent>
            {
              products?.map((product) => {
                return (
                  <CarouselItem className='basis-1/5' key={product.id}>
                    <ProductCard
                      key={product.id}
                      name={product.name}
                      price={product.price}
                      imageSrc={product.imageSrc}
                    />
                  </CarouselItem>
                );
              })}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      {/* Code From DEV */}

      <div className="px-4 py-1 border-b border-gray-800 flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger>Sort by</DropdownMenuTrigger>
          <DropdownMenuContent className="dark">
            <DropdownMenuItem>Price: Low to High</DropdownMenuItem>
            <DropdownMenuItem>Price: High to Low</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className='m-4'>
        <p>Products</p>

        {/* {loading && <LoadingSpinner />} */}
        {error && <p>There was an error loading the products</p>}
        {/* {!loading && !error && products &&
          <div className='my-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-10 place-items-center'>
            {products.map(product => (
              <ProductCard key={product.id} name={product.name} price={product.price} imageSrc={product.imageSrc} />
            ))}
          </div>} */}
      </div>

      <CartSheet onOpenChange={setCartOpen} open={cartOpen} />
      <div className="p-[2rem] grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-10 place-items-center">
        {loading && products ? (
          <LoadingSpinner />
        ) : (
          products?.map((product) => {
            return (
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
            );
          })
        )}
      </div>
    </div>
  );  
}