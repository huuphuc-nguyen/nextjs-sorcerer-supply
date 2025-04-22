"use client";

import React from "react";
import Image from "next/image";
import "./style.css";

import { User } from "lucide-react";
import { Mail } from "lucide-react";
import { MapPin } from "lucide-react";
import { Building2 } from "lucide-react";
import VisaLogo from "./assets/visa-logo-png-transparent.png";
import AmexLogo from "./assets/american express_amex_card.png";
import MasterLogo from "./assets/mastercard_icon.png";
import DiscoverLogo from "./assets/card_credit_discover_logo.png";
import CartLogo from "./assets/cart_shopping_icon.png";
import { useState, useEffect } from "react";
import { CartItem } from "../productPage/[collectionName]/[id]/page";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createOrderInDatabase } from "@/lib/firebase/order";
import { updateUserInDatabase } from "@/lib/firebase/users";
import { getAuth } from "firebase/auth";

const auth = getAuth();

const schema = z.object({
  cardName: z.string().min(1, "Cardholder name is required"),
  cardNumber: z.string().regex(/^\d{16}$/, "Card number must be 16 digits"),
  expMonth: z
    .string()
    .regex(/^(0[1-9]|1[0-2])$/, "Month must be 2 digits, from 01 to 12"),
  expYear: z.string().regex(/^\d{4}$/, "Year must be 4 digits"),
  cvv: z.string().regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
});

type CardFormSchema = z.infer<typeof schema>;

const Checkout = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [discountCode, setDiscountCode] = useState<string>("");
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CardFormSchema>({ resolver: zodResolver(schema) });

  // load cart items from local storage
  useEffect(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    if (storedCartItems) {
      setCartItems(JSON.parse(decodeURIComponent(storedCartItems)));
      console.log(
        "Cart items loaded from local storage:",
        JSON.parse(decodeURIComponent(storedCartItems))
      );
    }
  }, []);

  const handleDiscountCodeCheck = () => {
    if (discountCode === "mycode") {
      setDiscountAmount(10);
      toast({
        title: "Success",
        description: "Discount code applied successfully!",
        variant: "success",
      });
    } else {
      setDiscountAmount(0);
      toast({
        title: "Error",
        description: "Invalid discount code.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = (data: CardFormSchema) => {
    const currentCart = localStorage.getItem("cartItems");
    const cartItems = currentCart
      ? JSON.parse(decodeURIComponent(currentCart))
      : [];
    if (cartItems.length === 0) {
      toast({
        title: "Empty Cart",
        variant: "destructive",
        description:
          "Your cart is empty. Please add items to your cart before checking out.",
      });
      return;
    }
    const totalPayment =
      cartItems.reduce(
        (total: number, item: CartItem) =>
          total + (item.productData?.price ?? 0) * (item.quantity ?? 1),
        0
      ) *
        1.0825 -
      discountAmount;
    createOrderInDatabase(cartItems, totalPayment);
    toast({
      title: "Success",
      description: "Order created successfully!",
      variant: "success",
    });

    const user = auth.currentUser;
    updateUserInDatabase(user?.uid ?? "unknown_user", {
      payment: `Credit card: ${data.cardNumber.replace(/\d(?=\d{4})/g, "*")}`,
    });

    // Clear cart after order creation
    localStorage.removeItem("cartItems");
    setCartItems([]);
    window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto py-4">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <div className="flex flex-wrap flex-row items-center justify-center gap-4 h-fit">
        {/* Cart Summary */}
        <div className="first">
          <div className="bg-white text-black p-6 rounded shadow h-fit">
            <h4 className="text-lg font-semibold flex items-center">
              Cart{" "}
              <span className="ml-auto flex items-center">
                <Image
                  src={CartLogo}
                  alt="cart logo"
                  className=" w-5 h-5 mr-2"
                />{" "}
                <b>{cartItems.length}</b>
              </span>
            </h4>
            {cartItems.map((item, index) => (
              <div key={index} className="flex justify-between my-2">
                <p>
                  {item.productData?.name} x {item.quantity}
                </p>
                <p>
                  ${(item.productData?.price * (item.quantity ?? 1)).toFixed(2)}
                </p>
              </div>
            ))}
            <hr className="my-2" />
            <p className="flex justify-between font-semibold my-2">
              Subtotal{" "}
              <span>
                $
                {cartItems
                  .reduce(
                    (total, item) =>
                      total +
                      (item.productData?.price ?? 0) * (item.quantity ?? 1),
                    0
                  )
                  .toFixed(2)}
              </span>
            </p>
            <p className="flex justify-between my-2">
              Tax 8.25%{" "}
              <span>
                $
                {(
                  cartItems.reduce(
                    (total, item) =>
                      total +
                      (item.productData?.price ?? 0) * (item.quantity ?? 1),
                    0
                  ) * 0.0825
                ).toFixed(2)}
              </span>
            </p>
            <p className="flex justify-between my-2">
              Shipping <span>$0</span>
            </p>
            {discountAmount > 0 && (
              <p className="flex justify-between my-2">
                Discount <span>${discountAmount}</span>
              </p>
            )}
            <hr className="my-2" />
            <p className="flex justify-between font-semibold">
              Total{" "}
              <span>
                $
                {(
                  cartItems.reduce(
                    (total, item) =>
                      total +
                      (item.productData?.price ?? 0) * (item.quantity ?? 1),
                    0
                  ) *
                    1.0825 -
                  discountAmount
                ).toFixed(2)}
              </span>
            </p>
          </div>
        </div>

        {/* Discount block */}
        <div className="second">
          <div className="bg-white text-black p-6 rounded shadow">
            <h4 className="text-lg font-semibold flex items-center">
              Insert discount code here
            </h4>
            <input
              type="text"
              placeholder="ADVENTUREBEGINS2025"
              className="w-full p-2 border rounded mt-1 text-black"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleDiscountCodeCheck();
                }
              }}
            />
            <button
              className="group relative w-full overflow-hidden rounded p-3 border-black border-2 bg-white text-black hover:text-white transition-all duration-300"
              onClick={handleDiscountCodeCheck}
            >
              <span className="relative z-10">Apply discount</span>
              <span className="absolute left-0 top-0 h-full w-0 bg-black transition-all duration-500 group-hover:w-full"></span>
            </button>
          </div>
        </div>

        {/* Billing Address */}
        <div className="w-full md:w-3/4 px-4">
          <div className="bg-black text-white p-6 rounded shadow">
            <h3 className="text-lg font-semibold">Billing Address</h3>
            <label className="block mt-2">
              <span className="flex items-center">
                <User className="mr-2" /> Full Name
              </span>
              <input
                type="text"
                placeholder="John M. Doe"
                className="w-full p-2 border rounded mt-1 text-black"
              />
            </label>
            <label className="block mt-2">
              <span className="flex items-center">
                <Mail className="mr-2" />
                Email
              </span>
              <input
                type="text"
                placeholder="john@example.com"
                className="w-full p-2 border rounded mt-1 text-black"
              />
            </label>
            <label className="block mt-2">
              <span className="flex items-center">
                <MapPin className="mr-2" /> Address
              </span>
              <input
                type="text"
                placeholder="542 W. 15th Street"
                className="w-full p-2 border rounded mt-1 text-black"
              />
            </label>
            <label className="block mt-2">
              <span className="flex items-center">
                <Building2 className="mr-2" /> City
              </span>
              <input
                type="text"
                placeholder="San Antonio"
                className="w-full p-2 border rounded mt-1 text-black"
              />
            </label>
            <div className="flex -mx-2 mt-2">
              <div className="w-1/2 px-2">
                <label>State</label>
                <input
                  type="text"
                  placeholder="TX"
                  className="w-full p-2 border rounded text-black"
                />
              </div>
              <div className="w-1/2 px-2">
                <label>Zip</label>
                <input
                  type="text"
                  placeholder="10001"
                  className="w-full p-2 border rounded text-black"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card Summary */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full bg-white text-black p-6 rounded shadow space-y-3"
        >
          <h3 className="text-lg font-semibold">Payment</h3>
          <label>Accepted Cards</label>
          <div className="flex gap-2 mb-2">
            <Image
              src={VisaLogo}
              alt="visa logo"
              className="w-[52px] h-[22px]"
            />
            <Image
              src={AmexLogo}
              alt="amex logo"
              className="w-[42px] h-[22px]"
            />
            <Image
              src={MasterLogo}
              alt="mastercard logo"
              className="w-[42px] h-[22px]"
            />
            <Image
              src={DiscoverLogo}
              alt="discover logo"
              className="w-[42px] h-[22px]"
            />
          </div>
          <div>
            <label>Name on Card</label>
            <input
              {...register("cardName")}
              className="w-full p-2 border rounded mt-1"
              placeholder="John Doe"
            />
            {errors.cardName && (
              <p className="text-red-500 text-sm">{errors.cardName.message}</p>
            )}
          </div>
          <div>
            <label>Credit Card Number</label>
            <input
              {...register("cardNumber")}
              className="w-full p-2 border rounded mt-1"
              placeholder="1111222233334444"
            />
            {errors.cardNumber && (
              <p className="text-red-500 text-sm">
                {errors.cardNumber.message}
              </p>
            )}
          </div>
          <div>
            <label>Exp Month</label>
            <input
              {...register("expMonth")}
              className="w-full p-2 border rounded mt-1"
              placeholder="September"
            />
            {errors.expMonth && (
              <p className="text-red-500 text-sm">{errors.expMonth.message}</p>
            )}
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label>Exp Year</label>
              <input
                {...register("expYear")}
                className="w-full p-2 border rounded mt-1"
                placeholder="2028"
              />
              {errors.expYear && (
                <p className="text-red-500 text-sm">{errors.expYear.message}</p>
              )}
            </div>
            <div className="flex-1">
              <label>CVV</label>
              <input
                {...register("cvv")}
                className="w-full p-2 border rounded mt-1"
                placeholder="352"
              />
              {errors.cvv && (
                <p className="text-red-500 text-sm">{errors.cvv.message}</p>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="relative mx-auto block mt-8 w-1/2 bg-white boreder-black border-2 text-black p-3 rounded hover:text-white transition-all duration-300 group"
          >
            <span className="relative z-10">Finalize Checkout</span>
            <span className="absolute left-0 top-0 h-full w-0 group-hover:w-full bg-black duration-500 transition-all"></span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
