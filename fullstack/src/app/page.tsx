"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'nextjs-toploader/app';
import { getProducts, Product } from '@/lib/firebase/products';
//import { getAllProductDocuments } from "@/lib/firebase/allProducts";
import { LoadingSpinner } from '@/components/ui/spinner';
import { SiteHeader } from "@/components/SiteHeader/site-header";
import { ProductCard } from "@/components/ProductCard/product-card";
import { CartSheet } from '@/components/CartSheet/cart-sheet';
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
//import Image from "next/image";
import { useHeader } from "@/hooks/use-header";

export default function Home() {

  const router = useRouter();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  //const [products, setProducts] = useState<Product[]>();

  const {
    handleAuthClicked,
    handleCartClicked,
    handleAccountClicked,
    handleSearchClicked,
    authenticated,
    cartOpen,
    setSearchText,
    setCartOpen,
    cartProducts} = useHeader();

  useEffect(() => {
    getProducts()
      .then((products) => setFeaturedProducts(products))
      .catch((error) => {
        setError(true);
        console.error(error);
      })
      .finally(() => setLoading(false));
  }, []);

  // Fetch all products for CartSheet and product grid
  // useEffect(() => {
  //   getAllProductDocuments()
  //     .then((docs) => {
  //       // Map QueryDocumentSnapshot to Product[]
  //       const allProductsData = docs.map((doc) => {
  //         const data = doc.data();
  //         return {
  //           id: doc.id,
  //           name: data.name,
  //           price: data.price,
  //           imageSrc: data.imageSrc,
  //           collectionName: data.collectionName, // If needed for routing
  //         } as Product;
  //       });
  //       setProducts(allProductsData);
  //     })
  //     .catch((error) => {
  //       setError(true);
  //       console.error(error);
  //     });
  // }, []);


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
      <div className='flex justify-center py-4'>
        <Carousel className='w-full max-w-xl' id="hero-carousel" opts={{ loop: true }}>
          <CarouselContent>
            {images.map((value, index) => (
              <CarouselItem className="flex content-center" key={index}>
                <img src={value} alt={"fuck me man - ok"} />
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
          <div className="flex justify-center">
            <LoadingSpinner className="w-32 h-32" />
          </div>
        }
        {!loading &&
          <Carousel className='w-full'>
            <CarouselContent>
              {
                featuredProducts?.map((product) => {
                  return (
                    <CarouselItem className='basis-1/5' key={product.id}
                      onClick={() =>
                        router.push(`/productPage/${product.collectionName}/${product.id}`)
                      }
                      style={{ cursor: "pointer" }}>
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
        }
        {/* {loading && <LoadingSpinner />} */}
        {error && <p>There was an error loading the products</p>}
      </div>

      <CartSheet onOpenChange={setCartOpen} open={cartOpen} cartProducts={cartProducts}/>
    </div>
  );
}