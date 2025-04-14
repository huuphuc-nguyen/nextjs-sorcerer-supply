import { auth } from '@/lib/firebase/config';
import { getAuth, signOut } from "firebase/auth";
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'nextjs-toploader/app';
import { useEffect, useState } from "react";

export const useHeader = () => {

  const { toast } = useToast();
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchText, setSearchText] = useState<string>('');

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
    setCartOpen(true);
  };

  const handleAccountClicked = () => {
    router.push('/account');
  }

  const handleDashboardClicked = () => {
    router.push('/seller-dashboard');
  }

  return {
    handleDashboardClicked,
    handleAuthClicked,
    handleCartClicked,
    handleAccountClicked,
    handleSearchClicked,
    authenticated,
    cartOpen,
    searchText,
    setSearchText,
    setCartOpen,
  }
};