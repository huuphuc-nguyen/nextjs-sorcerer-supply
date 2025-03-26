"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'nextjs-toploader/app';
import { getAuth, signOut } from "firebase/auth";
import { auth } from '@/lib/firebase/config';
import { getProducts, Product } from '@/lib/firebase/products';
import { useToast } from '@/hooks/use-toast';
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

export default function Home() {

  const { toast } = useToast();
  const router = useRouter();

  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [products, setProducts] = useState<Product[]>();
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    // Get Firebase authentication
    const unsubscribe = auth.onAuthStateChanged(user => {
      setAuthenticated(user ? true : false);
    });

    // Get products from Firestore
    getProducts()
      .then(products => setProducts(products))
      .catch(error => { setError(true); console.error(error) })
      .finally(() => { setLoading(false) });

    // Clean up auth callback
    return () => { unsubscribe() }
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
  // const brands = [
  //   "Brand Placeholder 1",
  //   "Brand Placeholder 2"
  // ]

  const handleAuthClicked = async () => {
    const auth = getAuth();

    // Check for authentication status
    if (!authenticated) {
      // User isn't logged in, go to login page
      router.push('/login');

      return;
    }
    else {
      // User is logged in, try signing out
      try {
        await signOut(auth);

        toast({
          title: "Signed out",
          variant: "success",
          description: "You have been signed out.",
        });

        router.push('/');
      }
      catch (error) {
        console.error(error);

        toast({
          title: "Sign out failed",
          variant: "destructive",
          description: "Please try again.",
        });
      }
    }
  };

  const handleCartClicked = () => {
    setCartOpen(true);
  };

  const handleAccountClicked = () => {
    router.push('/account'); 
  }

  return (
    <div>
      <SiteHeader authenticated={authenticated} onAuthClicked={handleAuthClicked} onCartClicked={handleCartClicked} onAccountClicked={handleAccountClicked}/>
      
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
                          height={300}
                          width={300}/>
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
                  <CarouselItem className='basis-1/4' key={product.id}>
                    <ProductCard
                      key={product.id}
                      name={product.name}
                      price={(product.price / 100)}
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