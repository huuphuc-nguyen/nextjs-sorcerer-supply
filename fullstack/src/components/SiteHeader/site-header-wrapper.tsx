"use client";

import React, { useEffect, useState } from "react";
import { SiteHeader } from "./site-header";
import { CartSheet } from "../CartSheet/cart-sheet";
import { useHeader } from "@/hooks/use-header";
import { usePathname, useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";


interface HeaderWrapperProps {
  children?: React.ReactNode;
}

const HeaderWrapper = ({children} : HeaderWrapperProps) => {
  const HIDE_HEADER_ROUTES = ["login", "signup", "sellerDashboard", "addItems", "modifyItems", "order", "discount"];
  const ADMIN_ROUTE = ["sellerDashboard", "addItems", "modifyItems", "order", "discount"];
  const pathname = usePathname();
  const router = useRouter();

  const [loadingAuth, setLoadingAuth] = useState(true); // wait for Firebase
  const [isAdmin, setIsAdmin] = useState(false); // check if user is admin

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
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const isAdminRoute = ADMIN_ROUTE.includes(pathname.split("/")[1]);
      
      if (!user?.email?.includes("admin")) {
        setIsAdmin(false); // not an admin
      }
      else {
        setIsAdmin(true); // is an admin
      }

      if (isAdminRoute && !user?.email?.includes("admin")) {
        router.push("/"); // fast client-side redirect
      }
      else {
      }

      setLoadingAuth(false); // done checking
    });

    return () => unsubscribe();
  }, [pathname, router]);

  const shouldHideHeader = HIDE_HEADER_ROUTES.some(route =>
    pathname.split("/")[1]?.includes(route)
  );

  if (loadingAuth) {
    return null; // Or return a loading spinner here
  }
  
  if (!isAdmin && ADMIN_ROUTE.some(route => pathname.split("/")[1]?.includes(route))) {
    return null; // Prevent rendering if the user is not an admin
  }

  return (
    <>
      {!shouldHideHeader && (
        <div>
          <SiteHeader
            authenticated={authenticated}
            setSearchText={setSearchText}
            onDashboardClicked={handleDashboardClicked}
            onSearchClicked={handleSearchClicked}
            onAuthClicked={handleAuthClicked}
            onCartClicked={handleCartClicked}
            onAccountClicked={handleAccountClicked}
            isAdmin={isAdmin}
          />
          <CartSheet onOpenChange={setCartOpen} open={cartOpen} />
        </div>
      )}

      {loadingAuth ? null : children}
    </>
  );
};

export default HeaderWrapper;
