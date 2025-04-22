// This is a workaround to force the page to re-render when the cart is closed to update the stock quantity

import React, { createContext } from "react";

interface CartContextProps {
  trigger: boolean;
  setTrigger: React.Dispatch<React.SetStateAction<boolean>>;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [trigger, setTrigger] = React.useState<boolean>(false);

  return (
    <CartContext.Provider value={{ trigger, setTrigger }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
};
