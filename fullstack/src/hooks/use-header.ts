import { auth } from '@/lib/firebase/config';
import { getAuth, signOut } from "firebase/auth";
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'nextjs-toploader/app';
import { useEffect, useState } from "react";
import { CartItem } from '@/app/productPage/[collectionName]/[id]/page';

interface CartProduct {
  name: string,
  image: string,
  price: number,
  quantity: number
}

export const useHeader = () => {

  const { toast } = useToast();
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchText, setSearchText] = useState<string>('');
  const [cartProducts, setCartProducts] = useState<CartProduct[]>([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setAuthenticated(user ? true : false);
    });
    return () => { unsubscribe() }
  }, [])

  const handleSearchClicked = async () => {
    router.push(`/search?q=${encodeURIComponent(searchText)}`)
  }

  const handleAuthClicked = async () => {
    const auth = getAuth();

    if (!authenticated) {
      router.push('/login');

      return;
    }
    else {
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
    const currentCart = localStorage.getItem("cartItems");
    const cartItems = currentCart ? JSON.parse(decodeURIComponent(currentCart)) : [];
    
    const products: CartProduct[] = cartItems.map((item: CartItem) => {
      const product = item.productData;
      const quantity = item.quantity;
      
      return {
        name: product?.name,
        price: product?.price,
        quantity: quantity,
        image: product?.imageSrc,
      };
    });
    
    setCartProducts(products); 
    setCartOpen(true);
  };

  const handleAccountClicked = () => {
    router.push('/account');
  }

  return {
    handleAuthClicked,
    handleCartClicked,
    handleAccountClicked,
    handleSearchClicked,
    authenticated,
    cartOpen,
    searchText,
    setSearchText,
    setCartOpen,
    cartProducts,
  }
};