"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'nextjs-toploader/app';
import { getProducts, Product } from '@/lib/firebase/products';
import { LoadingSpinner } from '@/components/ui/spinner';
import { SiteHeader } from "@/components/SiteHeader/site-header";
import { ProductCard } from "@/components/ProductCard/product-card";
import { CartSheet } from '@/components/CartSheet/cart-sheet';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useHeader } from "@/hooks/use-header";
import Image from "next/image";

export default function Home() {

  const router = useRouter();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const {
    handleAuthClicked,
    handleCartClicked,
    handleAccountClicked,
    handleSearchClicked,
    handleDashboardClicked,
    authenticated,
    cartOpen,
    setSearchText,
    setCartOpen,
  } = useHeader();

  useEffect(() => {
    getProducts()
      .then((products) => setFeaturedProducts(products))
      .catch((error) => {
        setError(true);
        console.error(error);
      })
      .finally(() => setLoading(false));
  }, []);

  const images = [
    '/banner_3.png',
    '/banner_1.png',
    '/banner_2.png',
    '/banner_4.png',
  ];

  return (
    <div>
      <SiteHeader authenticated={authenticated} setSearchText={setSearchText} onDashboardClicked={handleDashboardClicked} onSearchClicked={handleSearchClicked} onAuthClicked={handleAuthClicked} onCartClicked={handleCartClicked} onAccountClicked={handleAccountClicked} />
      <div className='flex justify-center py-4 overflow-y-auto'>
        <Carousel className='w-full max-w-xl' id="hero-carousel" opts={{ loop: true }}>
          <CarouselContent>
            {images.map((value, index) => (
              <CarouselItem className="flex content-center" key={index}>
                <div className="relative w-full h-60 md:h-72 lg:h-80">
                  <Image
                    src={value}
                    alt={`banner_${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                    priority
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      <div className='flex flex-col gap-4 justify-center w-full px-[10%] py-4'>
        <p>Featured</p>
        {loading &&
          <div className="flex justify-center items-center gap-4">
            <LoadingSpinner className="w-16 aspect-square" />
            <p>Loading products...</p>
          </div>
        }
        {!loading &&
          <Carousel className='w-full'>
            <CarouselContent>
              {featuredProducts?.map((product) => (
                <CarouselItem
                  className='basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5'
                  key={product.id}
                  onClick={() => router.push(`/productPage/${product.collectionName}/${product.id}`)}
                  style={{ cursor: "pointer" }}>
                  <ProductCard
                    key={product.id}
                    name={product.name}
                    price={product.price}
                    imageSrc={product.imageSrc}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        }
        {error && <p className="text-red-400 text-center">There was an error loading the products</p>}
      </div>

        <CartSheet onOpenChange={setCartOpen} open={cartOpen} />
    </div>
  );
}
