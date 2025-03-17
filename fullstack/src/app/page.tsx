"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
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

<<<<<<< HEAD
import { auth } from '@/app/firebase/config';
import { getAuth, signOut } from "firebase/auth";
import { getProductDocuments } from '@/app/firebase/products';

import { ProductDocumentData } from "@/types/product-document-data";

import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

import { useEffect, useState } from "react";

import { useToast } from '@/hooks/use-toast';

import { useRouter } from 'next/navigation';

=======
>>>>>>> dev
export default function Home() {

  const { toast } = useToast();
  const router = useRouter();

  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
<<<<<<< HEAD
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productDocuments, setProductDocuments] = useState<QueryDocumentSnapshot<DocumentData, DocumentData>[]>([]);
  const { toast } = useToast();
  const router = useRouter(); 
=======
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [products, setProducts] = useState<Product[]>();
  const [cartOpen, setCartOpen] = useState(false);
>>>>>>> dev

  useEffect(() => {
    // Get Firebase authentication
    const unsubscribe = auth.onAuthStateChanged(user => {
      setAuthenticated(user ? true : false);
    });

    // Get products from Firestore
<<<<<<< HEAD
    setLoadingProducts(true);

    getProductDocuments()
      .then(docs => {
        setProductDocuments(docs);
        setLoadingProducts(false);
      });
=======
    getProducts()
      .then(products => setProducts(products))
      .catch(_ => { setError(true) })
      .finally(() => { setLoading(false) });
>>>>>>> dev

    // Clean up auth callback
    return () => { unsubscribe() }
  }, []);

<<<<<<< HEAD
  const handleClick = async () => {
    const auth = getAuth();

    if (!authenticated) {
      router.push('/login');
      return;
    }
    else {
      try {
        await signOut(auth);
=======
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

>>>>>>> dev
        toast({
          title: "Signed out",
          variant: "success",
          description: "You have been signed out.",
        });
<<<<<<< HEAD
        router.push('/');
      } catch (error) {
        console.error(error);
=======

        router.push('/');
      }
      catch (error) {
        console.error(error);

>>>>>>> dev
        toast({
          title: "Sign out failed",
          variant: "destructive",
          description: "Please try again.",
        });
      }
    }
  };

<<<<<<< HEAD
  return (
    <div>
      <SiteHeader authenticated={authenticated} onAuthClicked={handleClick} />
=======
  const handleCartClicked = () => {
    setCartOpen(true);
  };

  return (
    <div>
      <SiteHeader authenticated={authenticated} onAuthClicked={handleAuthClicked} onCartClicked={handleCartClicked} />
>>>>>>> dev
      <div className="px-4 py-1 border-b border-gray-800 flex justify-end">
        <DropdownMenu >
          <DropdownMenuTrigger>Sort by</DropdownMenuTrigger>
          <DropdownMenuContent className='dark'>
            <DropdownMenuItem>Price: Low to High</DropdownMenuItem>
            <DropdownMenuItem>Price: High to Low</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className='m-4'>
        <p>Products</p>

        {loading && <LoadingSpinner />}
        {error && <p>There was an error loading the products</p>}
        {!loading && !error && products &&
          <div className='my-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-10 place-items-center'>
            {products.map(product => (
              <ProductCard key={product.id} name={product.name} price={product.price} imageSrc={product.imageSrc} />
            ))}
          </div>}
      </div>
<<<<<<< HEAD
      <div className="p-[2rem] grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-10 place-items-center">
        {loadingProducts ? <LoadingSpinner/> : productDocuments.map((doc) => {
          const data = doc.data() as QueryDocumentSnapshot<ProductDocumentData>;
          return (
            <ProductCard
            key={doc.id}
            name={doc.data().name}
            price={ doc.data().price }
            imageSrc={ doc.data().imageSrc }
            />
          );
        })}
      </div>
=======

      <CartSheet onOpenChange={setCartOpen} open={cartOpen} />
>>>>>>> dev
    </div>
  );
}