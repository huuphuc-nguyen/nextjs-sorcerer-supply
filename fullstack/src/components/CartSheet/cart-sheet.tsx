'use client'
import React, {useEffect, useState} from "react";
import { ChevronLeft, ChevronRight, ShoppingBasket, Trash } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { DialogProps } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import Image from "next/image";
import { CartItem } from "@/app/productPage/[collectionName]/[id]/page";

interface CartProduct {
    name: string,
    image: string,
    price: number,
    quantity: number
  }

export function CartSheet({ ...rest }: DialogProps){
    const [cart, setCart] = useState<CartProduct[]>([]);

    useEffect(() => {
        if (!rest.open) return;
        const currentCart = localStorage.getItem("cartItems");
        const cartItems = currentCart ? JSON.parse(decodeURIComponent(currentCart)) : [];

        console.log("Cart items loaded from localStorage:", cartItems);
        
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
        console.log("Cart items loaded from localStorage:", products);
        setCart(products); 
    },[rest.open]);

    const handleIncreaseClicked = (name: string) => {
        setCart((prevCart) => {
            const updatedCart = prevCart.map((product) => {
                if (product.name == name) {
                    product.quantity += 1; // Decrease the quantity
                }
                return product;
            });
            return updatedCart;
        });

        const currentCart = localStorage.getItem("cartItems");
        const cartItems = currentCart ? JSON.parse(decodeURIComponent(currentCart)) : [];
        cartItems.map((item: CartItem) => {
            if (item?.productData?.name == name && item.quantity) {
                item.quantity += 1;
            }
        });
        localStorage.setItem("cartItems", encodeURIComponent(JSON.stringify(cartItems)));
    };

    const handleDecreaseClicked = (name: string) => {
        setCart((prevCart) => {
            const updatedCart = prevCart.map((product) => {
                if (product.name == name && product.quantity > 1) {
                    product.quantity -= 1; // Decrease the quantity
                }
                return product;
            });
            return updatedCart;
            
        });

        const currentCart = localStorage.getItem("cartItems");
        const cartItems = currentCart ? JSON.parse(decodeURIComponent(currentCart)) : [];
        cartItems.map((item: CartItem) => {
            if (item?.productData?.name == name && item.quantity) {
                item.quantity -= 1;
            }
        });
        localStorage.setItem("cartItems", encodeURIComponent(JSON.stringify(cartItems)));
    };

    const handleRemoveItemClicked = (name: string) => {
        
        const currentCart = localStorage.getItem("cartItems");
        const cartItems = currentCart ? JSON.parse(decodeURIComponent(currentCart)) : [];
        const updatedCartItems = cartItems.filter((item: CartItem) => item?.productData?.name !== name);
        localStorage.setItem("cartItems", encodeURIComponent(JSON.stringify(updatedCartItems)));

        setCart((prevCart) => {
            const updatedCart = prevCart.filter((product) => product.name !== name);
            return updatedCart;
        });
    };

    return (
        <Sheet {...rest}>
            <SheetContent className="dark min-w-[30%]">
                <SheetHeader className="mb-4">
                    <SheetTitle>Shopping Cart</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 ">
                    <div className="grid grid-cols-[auto,auto,auto,auto] gap-4">
                        <p className="font-bold text-center">Details</p>
                        <p className="font-bold text-center">Price</p>
                        <p className="font-bold text-center">Quantity</p>
                        <p className="font-bold text-center">Delete</p>
                        {cart.map((product) => (
                            <React.Fragment key={product.name}>
                                <div className="flex items-center gap-2">
                                    <Image className="aspect-square w-12 rounded-md" src={product.image} alt="Next.js Logo" width={48} height={48} />
                                    <p>{product.name}</p>
                                </div>
                                <div className="flex items-center">
                                    <p>{product.price}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button variant="outline" size="icon" onClick={()=>handleDecreaseClicked(product.name)}><ChevronLeft /></Button>
                                    <p>{product.quantity}</p>
                                    <Button variant="outline" size="icon" onClick={()=>handleIncreaseClicked(product.name)}><ChevronRight /></Button>
                                </div>
                                <div className="flex justify-center items-center">
                                    <Trash className="cursor-pointer" onClick={()=>handleRemoveItemClicked(product.name)}/>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                    <div className="flex justify-center">
                        <Button className="dark w-full"><ShoppingBasket />Checkout</Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}