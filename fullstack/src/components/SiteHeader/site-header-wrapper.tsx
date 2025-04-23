// This is a wrapper component for the SiteHeader component to make it able to used in the root layout
"use client";

import React from "react";
import { SiteHeader } from "./site-header";
import { CartSheet } from "../CartSheet/cart-sheet";
import { useHeader } from "@/hooks/use-header";
import { usePathname } from "next/navigation";


const HeaderWrapper = () => {
    const HIDE_HEADER_ROUTES = ["/login", "/signup", "/sellerDashboard", "/addItems", "/modifyItems", "/orders"];
    const pathname = usePathname();
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
  return (
    <>{
        !HIDE_HEADER_ROUTES.includes(pathname) && (
          <div>
            <SiteHeader
              authenticated={authenticated}
              setSearchText={setSearchText}
              onDashboardClicked={handleDashboardClicked}
              onSearchClicked={handleSearchClicked}
              onAuthClicked={handleAuthClicked}
              onCartClicked={handleCartClicked}
              onAccountClicked={handleAccountClicked}
            />
            <CartSheet onOpenChange={setCartOpen} open={cartOpen} />
          </div>
        )
    }
    </>
  );
};

export default HeaderWrapper;
