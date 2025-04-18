'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import { getCategory } from "@/lib/firebase/getCategory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "next/navigation";

type Product = {
    name: string;
    price: number;
    id?: string;
    imageSrc?: string;
    collectionName?: string;
};

type Order = {
    id: number;
    customer: string;
    date: string;
    total: number;
};

const sampleOrders: Order[] = [
    { id: 1, customer: "Mira the Wise", date: "2025-04-12", total: 199.99 },
    { id: 2, customer: "Thorne Oakenshield", date: "2025-04-10", total: 349.00 },
    { id: 3, customer: "Elira Sunblade", date: "2025-04-11", total: 89.50 },
];

const SellerDashboard = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const categories = [
                    "wands",
                    "spellBooks",
                    "staffs",
                    "scrolls",
                    "magicItems",
                    "ingredients",
                    "cursedItems",
                    "creatures"
                ];

                const allProducts: Product[] = [];

                for (const category of categories) {
                    const productsInCategory = await getCategory(category);
                    const mapped = productsInCategory.map((product: any) => ({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        imageSrc: product.imageSrc,
                        collectionName: category,
                    }));
                    allProducts.push(...mapped);
                }

                setProducts(allProducts);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="bg-black text-white min-h-screen px-6 py-4">
            {/* Navbar */}
            <nav className="flex justify-between items-center border-b border-gray-800 pb-4 mb-6">
                <h1 className="text-2xl font-bold">Seller Dashboard</h1>
                <div className="flex gap-4 text-sm font-medium">
                    <a href="#" className="hover:underline">Dashboard</a>
                    <a href="#" className="hover:underline">Products</a>
                    <a href="#" className="hover:underline">Checkout</a>
                    <a href="#" className="hover:underline">Discounts</a>
                </div>
            </nav>

            {/* Profile Section */}
            <div className="bg-gray-900 p-6 rounded-xl shadow-md flex items-center mb-6">
                <Image
                    src="/profile.jpg"
                    alt="Seller Profile"
                    width={80}
                    height={80}
                    className="rounded-full border-2 border-gray-700"
                />
                <div className="ml-4">
                    <h2 className="text-xl font-bold">Profile Name</h2>
                    <p className="text-gray-400">Home & Furniture Seller</p>
                    <div className="flex gap-4 mt-2 text-gray-400 text-sm">

                    </div>
                </div>
            </div>

            {/* Product Listings */}
            <h2 className="text-lg font-semibold">Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {loading ? (
                    <p className="text-gray-400">Loading products...</p>
                ) : (
                    products.map((product) => (
                        <Card key={product.id} className="bg-gray-900 border border-gray-700 text-white">
                            <CardHeader>
                                <CardTitle>{product.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-400">${product.price.toFixed(2)}</p>
                                <button className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded">s</button>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Store Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <Card className="bg-gray-900 border border-gray-700 text-white">
                    <CardHeader>
                        <CardTitle>Store Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg">Products: {products.length}</p>
                        <p className="text-lg">Total Sales: ${sampleOrders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Order */}
            <div className="mt-6">
                <h2 className="text-lg font-semibold">Order History</h2>
                <div className="grid grid-cols-1 gap-4 mt-2">
                    {sampleOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(order => (
                        <Card key={order.id} className="bg-gray-900 border border-gray-700 text-white">
                            <CardHeader>
                                <CardTitle>Order #{order.id}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>Customer: {order.customer}</p>
                                <p>Date: {order.date}</p>
                                <p>Total: ${order.total.toFixed(2)}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SellerDashboard;