'use client';

import React from "react";
import { SiteHeader } from "@/components/SiteHeader/site-header";
import { useHeader } from "@/hooks/use-header";
import { CartSheet } from "@/components/CartSheet/cart-sheet";

const AccountLayout = ({ children }: { children: React.ReactNode }) => {

  const {
    handleAuthClicked,
    handleCartClicked,
    handleAccountClicked,
    handleDashboardClicked,
    handleSearchClicked,
    authenticated,
    cartOpen,
    setSearchText,
    setCartOpen,} = useHeader();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <SiteHeader authenticated={authenticated} setSearchText={setSearchText} onDashboardClicked={handleDashboardClicked} onSearchClicked={handleSearchClicked} onAuthClicked={handleAuthClicked} onCartClicked={handleCartClicked} onAccountClicked={handleAccountClicked}/>
      
      {/* Main Content */}
      <main className="flex-grow p-8">{children}</main>

      {/* Cart Sheet*/}
      <CartSheet onOpenChange={setCartOpen} open={cartOpen} />
    </div>
  );
};

export default AccountLayout;