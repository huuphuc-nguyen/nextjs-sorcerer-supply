

"use client";

import React from "react";
import Image from 'next/image';
import "./style.css";

import UserIcon from '../../assets/checkout/user_icon.png';
import EmailIcon from "../../assets/checkout/email_icon.png";
import AddressIcon from "../../assets/checkout/address_icon.png";
import CityIcon from "../../assets/checkout/city_icon.png";
import VisaLogo from "../../assets/checkout/visa-logo-png-transparent.png"
import AmexLogo from "../../assets/checkout/american express_amex_card.png"
import MasterLogo from "../../assets/checkout/mastercard_icon.png"
import DiscoverLogo from "../../assets/checkout/card_credit_discover_logo.png"
import CartLogo from "../../assets/checkout/cart_shopping_icon.png"


const Checkout = () => {
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Checkout</h1>
            <div className="flex flex-wrap -mx-4">
                {/* Cart Summary */}
                <div className="first">
                    <div className="bg-white text-black p-6 rounded shadow">
                        <h4 className="text-lg font-semibold flex items-center">
                            Cart{" "}
                            <span className="ml-auto flex items-center">
                                <Image src={CartLogo} alt="cart logo" className=" w-5 h-5 mr-2" /> <b>4</b>
                            </span>
                        </h4>
                        <p className="flex justify-between">
                            Healing Potion <span>$15</span>
                        </p>
                        <p className="flex justify-between">
                            Wind Staff <span>$50</span>
                        </p>
                        <p className="flex justify-between">
                            Intermediate Grimoire <span>$82</span>
                        </p>
                        <p className="flex justify-between">
                            Magic Cloak <span>$25</span>
                        </p>
                        <p className="flex justify-between">
                            Sales Tax <span>$14.19</span>
                        </p>
                        <hr className="my-2" />
                        <p className="flex justify-between font-semibold">
                            Total <span>$186.19</span>
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
                            />
                            <button className="mt- w-full bg-green-600 text-white p-3 rounded hover:bg-green-700">
                                Insert discount
                            </button>
                    </div>
                    
                </div>

                {/* Billing Address */}
                <div className="w-full md:w-3/4 px-4">
                    <div className="bg-black text-white p-6 rounded shadow">
                        <h3 className="text-lg font-semibold">Billing Address</h3>
                        <label className="block mt-2">
                            <span className="flex items-center">
                                <Image src={UserIcon} alt="user logo" className="invert w-5 h-5 mr-2" /> Full Name
                            </span>
                            <input
                                type="text"
                                placeholder="John M. Doe"
                                className="w-full p-2 border rounded mt-1 text-black"
                            />
                        </label>
                        <label className="block mt-2">
                            <span className="flex items-center">
                                <Image src={EmailIcon} alt="email logo" className="invert w-5 h-5 mr-2" />Email
                            </span>
                            <input
                                type="text"
                                placeholder="john@example.com"
                                className="w-full p-2 border rounded mt-1 text-black"
                            />
                        </label>
                        <label className="block mt-2">
                            <span className="flex items-center">
                                <Image src={AddressIcon} alt="address logo" className="invert w-4 h-5 mr-2" /> Address
                            </span>
                            <input
                                type="text"
                                placeholder="542 W. 15th Street"
                                className="w-full p-2 border rounded mt-1 text-black"
                            />
                        </label>
                        <label className="block mt-2">
                            <span className="flex items-center">
                                <Image src={CityIcon} alt="city logo" className="invert w-5 h-5 mr-2" /> City
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

                

                {/* Cart Summary */}
                <div className="col-50">
                    <h3>Payment</h3>
                    <label htmlFor="fname">Accepted Cards</label>
                    <div className="icon-container">
                        <Image src={VisaLogo} alt="visa logo" className="w-[52px] h-[22px]" />
                        <Image src={AmexLogo} alt="amex logo" className="w-[42px] h-[22px]" />
                        <Image src={MasterLogo} alt="mastercard logo" className="w-[42px] h-[22px]" />
                        <Image src={DiscoverLogo} alt="discover logo" className="w-[42px] h-[22px]" />
                    </div>
                    <label htmlFor="cname">Name on Card</label>
                    <input type="text" id="cname" name="cardname" placeholder="John  Doe" />
                    <label htmlFor="ccnum">Credit card number</label>
                    <input type="text" id="ccnum" name="cardnumber" placeholder="1111-2222-3333-4444" />
                    <label htmlFor="expmonth">Exp Month</label>
                    <input type="text" id="expmonth" name="expmonth" placeholder="September" />
                    <div className="row">
                        <div className="col-50">
                            <label htmlFor="expyear">Exp Year</label>
                            <input type="text" id="expyear" name="expyear" placeholder="2028" />
                        </div>
                        <div className="col-50">
                            <label htmlFor="cvv">CVV</label>
                            <input type="text" id="cvv" name="cvv" placeholder="352" />
                        </div>
                    </div>
                </div>

                
            </div>
            <button className="mt-6 w-full bg-green-600 text-white p-3 rounded hover:bg-green-700">
                Finalize Checkout
            </button>
        </div>
    );
};

export default Checkout;