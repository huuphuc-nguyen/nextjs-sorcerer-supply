// Workaround for using a context provider in a server component

"use client";

import { CartProvider } from "@/context/cartContext";

export function Provider({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
