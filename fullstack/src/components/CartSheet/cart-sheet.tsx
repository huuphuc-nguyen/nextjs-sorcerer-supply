"use client";
import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ShoppingBasket, Trash } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { DialogProps } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import Image from "next/image";
import { CartItem } from "@/app/productPage/[collectionName]/[id]/page";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "nextjs-toploader/app";
import { getProductByID, updateProductQuantity } from "@/lib/firebase/products";
import { useCartContext } from "@/context/cartContext";

interface CartProduct {
  name: string;
  image: string;
  price: number;
  quantity: number;
}
export function CartSheet({ onOpenChange, ...rest }: DialogProps) {
  const [cart, setCart] = useState<CartProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setTrigger } = useCartContext();

  useEffect(() => {
    if (!rest.open) {
      setTrigger((prev) => !prev); // Trigger a re-render to update stock quantity when cart closes
      return;
    }
    const currentCart = localStorage.getItem("cartItems");
    const cartItems = currentCart
      ? JSON.parse(decodeURIComponent(currentCart))
      : [];

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

    setCart(products);
  }, [rest.open]);

  const handleIncreaseClicked = (name: string) => {
    setIsLoading(true);
    const currentCart = localStorage.getItem("cartItems");
    const cartItems = currentCart
      ? JSON.parse(decodeURIComponent(currentCart))
      : [];
    const productFound: CartItem = cartItems.find(
      (item: CartItem) => item?.productData?.name == name
    );
    getProductByID(
      productFound?.productData?.collectionName,
      productFound?.productID ?? ""
    ).then((product) => {
      if ((product?.quantity ?? 0) <= 0) {
        toast({
          title: "Out of Stock",
          variant: "destructive",
          description: "This item is currently out of stock.",
        });
        setIsLoading(false);

        return;
      } else {
        setCart((prevCart) => {
          const updatedCart = prevCart.map((product) => {
            if (product.name == name) {
              product.quantity += 1; // Decrease the quantity
            }
            return product;
          });
          return updatedCart;
        });

        cartItems.map((item: CartItem) => {
          if (item?.productData?.name == name && item.quantity) {
            item.quantity += 1;
          }
        });
        localStorage.setItem(
          "cartItems",
          encodeURIComponent(JSON.stringify(cartItems))
        );

        updateProductQuantity(
          productFound?.productData?.collectionName,
          productFound?.productID ?? "",
          (product?.quantity ?? 0) - 1
        );

        toast({
          title: "Quantity updated",
          variant: "success",
          description: `One more ${name} has been added to your cart.`,
        });
        setIsLoading(false);
      }
    });
  };

  const handleDecreaseClicked = (name: string) => {
    console.log("Decrease clicked");
    setIsLoading(true);
    const currentCart = localStorage.getItem("cartItems");
    const cartItems = currentCart
      ? JSON.parse(decodeURIComponent(currentCart))
      : [];
    const productFound: CartItem = cartItems.find(
      (item: CartItem) => item?.productData?.name == name
    );

    if ((productFound.quantity ?? 0) <= 1) {
      handleRemoveItemClicked(name);
      setIsLoading(false);
      return;
    }
    getProductByID(
      productFound?.productData?.collectionName,
      productFound?.productID ?? ""
    ).then((product) => {
      setCart((prevCart) => {
        const updatedCart = prevCart.map((product) => {
          if (product.name == name) {
            product.quantity -= 1; // Decrease the quantity
          }
          return product;
        });
        return updatedCart;
      });

      cartItems.map((item: CartItem) => {
        if (item?.productData?.name == name && item.quantity) {
          item.quantity -= 1;
        }
      });
      localStorage.setItem(
        "cartItems",
        encodeURIComponent(JSON.stringify(cartItems))
      );

      updateProductQuantity(
        productFound?.productData?.collectionName,
        productFound?.productID ?? "",
        (product?.quantity ?? 0) + 1
      );

      toast({
        title: "Quantity updated",
        variant: "success",
        description: `One ${name} has been removed to your cart.`,
      });
      setIsLoading(false);
    });
  };

  const handleRemoveItemClicked = (name: string) => {
    setIsLoading(true);
    const currentCart = localStorage.getItem("cartItems");
    const cartItems = currentCart
      ? JSON.parse(decodeURIComponent(currentCart))
      : [];
    const productFound: CartItem = cartItems.find(
      (item: CartItem) => item?.productData?.name == name
    );
    getProductByID(
      productFound?.productData?.collectionName,
      productFound?.productID ?? ""
    ).then((product) => {
      updateProductQuantity(
        productFound?.productData?.collectionName,
        productFound?.productID ?? "",
        (product?.quantity ?? 0) + (productFound?.quantity ?? 0)
      );

      const updatedCartItems = cartItems.filter(
        (item: CartItem) => item?.productData?.name !== name
      );
      localStorage.setItem(
        "cartItems",
        encodeURIComponent(JSON.stringify(updatedCartItems))
      );

      setCart((prevCart) => {
        const updatedCart = prevCart.filter((product) => product.name !== name);
        return updatedCart;
      });

      toast({
        title: "Item removed from cart",
        variant: "success",
        description: `${name} has been removed from your cart.`,
      });
      setIsLoading(false);
    });
  };

  const handleCheckoutClicked = () => {
    if (cart.length == 0) {
      toast({
        title: "Empty Cart",
        variant: "destructive",
        description: "Your cart is empty.",
      });
      return;
    }
    router.push("/checkout");
    onOpenChange?.(false);
  };

  return (
    <Sheet {...rest}>
      <SheetContent className="dark min-w-[30%]">
        <SheetHeader className="mb-4">
          <SheetTitle>Shopping Cart</SheetTitle>
        </SheetHeader>
        <SheetClose asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={() => onOpenChange?.(false)}
          >
            X
          </Button>
        </SheetClose>
        <div className="flex flex-col gap-4 ">
          <div className="grid grid-cols-[auto,auto,auto,auto] gap-4">
            <p className="font-bold text-center">Details</p>
            <p className="font-bold text-center">Price</p>
            <p className="font-bold text-center">Quantity</p>
            <p className="font-bold text-center">Delete</p>
            {cart.map((product) => (
              <React.Fragment key={product.name}>
                <div className="flex items-center gap-2">
                  <Image
                    className="aspect-square w-12 rounded-md"
                    src={product.image}
                    alt="Next.js Logo"
                    width={48}
                    height={48}
                  />
                  <p>{product.name}</p>
                </div>
                <div className="flex items-center">
                  <p>{product.price}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={isLoading}
                    onClick={() => handleDecreaseClicked(product.name)}
                  >
                    <ChevronLeft />
                  </Button>
                  <p>{product.quantity}</p>
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={isLoading}
                    onClick={() => handleIncreaseClicked(product.name)}
                  >
                    <ChevronRight />
                  </Button>
                </div>
                <div className="flex justify-center items-center">
                  <Trash
                    className="cursor-pointer"
                    onClick={() => handleRemoveItemClicked(product.name)}
                  />
                </div>
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-center">
            <Button className="dark w-full" onClick={handleCheckoutClicked}>
              <ShoppingBasket />
              Checkout
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
