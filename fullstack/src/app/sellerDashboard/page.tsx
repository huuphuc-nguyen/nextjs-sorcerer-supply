"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getCategory } from "@/lib/firebase/getCategory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AdminOrder,
  getAllOrdersFromDatabase,
  updateOrderStatus,
} from "@/lib/firebase/order";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ListFilter } from "lucide-react";

type Product = {
  name: string;
  price: number;
  id?: string;
  imageSrc?: string;
  collectionName?: string;
};

const SellerDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOrdersLoading, setOrdersLoading] = useState(true);

  // States for orders
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<AdminOrder[]>([]);
  const [sortBy, setSortBy] = useState("descending");
  const [categoryToSort, setCategoryToSort] = useState("date");

  // Fetch Orders from the database
  const fetchOrders = async () => {
    getAllOrdersFromDatabase()
      .then((orders) => {
        setOrders(orders);
        setFilteredOrders(orders);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      })
      .finally(() => {
        setOrdersLoading(false);
      });
  };
  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter and Sort Orders
  useEffect(() => {
    if (sortBy === "ascending") {
      setFilteredOrders((prevOrders) =>
        [...prevOrders].sort((a, b) => {
          if (categoryToSort === "date") {
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          } else if (categoryToSort === "customer") {
            return a.customerFullname.localeCompare(b.customerFullname);
          } else if (categoryToSort === "total") {
            return a.total - b.total;
          }
          return 0;
        })
      );
    } else if (sortBy === "descending") {
      setFilteredOrders((prevOrders) =>
        [...prevOrders].sort((a, b) => {
          if (categoryToSort === "date") {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          } else if (categoryToSort === "customer") {
            return b.customerFullname.localeCompare(a.customerFullname);
          } else if (categoryToSort === "total") {
            return b.total - a.total;
          }
          return 0;
        })
      );
    }
  }, [sortBy, categoryToSort, orders]);

  // Fetch Products from the database
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
          "creatures",
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

  // Handle Order Status Change
  const handleStatusChange = async (order: AdminOrder, status: string) => {
    updateOrderStatus(order.userId, order.id, status);
    fetchOrders(); // Refresh orders after updating status
  };

  return (
    <div className="bg-black text-white min-h-screen px-6 py-4">
      {/* Navbar */}
      <nav className="flex justify-between items-center border-b border-gray-800 pb-4 mb-6">
        <h1 className="text-2xl font-bold">Seller Dashboard</h1>
        <div className="flex gap-4 text-sm font-medium">
          <a href="#" className="hover:underline">
            Dashboard
          </a>
          <a href="#" className="hover:underline">
            Products
          </a>
          <a href="#" className="hover:underline">
            Checkout
          </a>
          <a href="#" className="hover:underline">
            Discounts
          </a>
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
          <div className="flex gap-4 mt-2 text-gray-400 text-sm"></div>
        </div>
      </div>

      {/* Product Listings */}
      <h2 className="text-lg font-semibold">Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {loading ? (
          <p className="text-gray-400">Loading products...</p>
        ) : (
          products.map((product) => (
            <Card
              key={product.id}
              className="bg-gray-900 border border-gray-700 text-white"
            >
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">${product.price}</p>
                <button className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded">
                  s
                </button>
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
            <p className="text-lg">
              Total Sales: $
              {orders
                .filter((order) => order.status === "pending")
                .reduce((sum, order) => sum + order.total, 0)
                .toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Order */}
      <div className="flex flex-row items-center mt-6 justify-between">
        <h2 className="md:text-lg text-md font-semibold">Order History</h2>
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="items-center font-bold gap-2 md:flex hidden">Order By <ListFilter/></div>
              <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
                <SelectTrigger className="w-[150px] tex">
                  <SelectValue placeholder="Order By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Order By</SelectLabel>
                    <SelectItem value="descending">Descending</SelectItem>
                    <SelectItem value="ascending">Ascending</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
          </div>

          <div className="flex items-center gap-2">
            <div className="items-center font-bold gap-2 md:flex hidden">Sort by <ListFilter/></div>
            <Select
            value={categoryToSort}
            onValueChange={(value) => setCategoryToSort(value)}
          >
            <SelectTrigger className="w-[150px] tex">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Sort By</SelectLabel>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="customer">Customer&apos;s name</SelectItem>
                <SelectItem value="total">Total purchased</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          </div>


        </div>
      </div>

      {isOrdersLoading ? (
        <div className="flex justify-start mt-4">
          <p className="text-gray-400">Loading orders...</p>
        </div>
      ) : (
        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            {filteredOrders
              //   .sort((a, b) => {
              //     const dateA = new Date(a.createdAt);
              //     const dateB = new Date(b.createdAt);
              //     return dateB.getTime() - dateA.getTime();
              //   })
              .map((order) => (
                <Card
                  key={order.id}
                  className="bg-gray-900 border border-gray-700 text-white rounded-lg p-2 shadow-lg"
                >
                  <CardHeader className="border-b border-gray-700 pb-4">
                    <CardTitle className="text-xl font-semibold">
                      <div className="flex justify-between items-center flex-wrap">
                        <span>Order #{order.id}</span>
                        {/* Status Tag */}
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-semibold ${
                            order.status === "pending"
                              ? "bg-yellow-500 text-white"
                              : order.status === "complete"
                              ? "bg-green-500 text-white"
                              : "bg-red-500 text-white"
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Status:</span>
                      <Select
                        value={order.status}
                        onValueChange={(value) =>
                          handleStatusChange(order, value)
                        }
                      >
                        <SelectTrigger className="w-[120px] tex">
                          <SelectValue placeholder="Change order status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Status</SelectLabel>
                            <SelectItem value="pending">Peding</SelectItem>
                            <SelectItem value="complete">Complete</SelectItem>
                            <SelectItem value="cancel">Cancel</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Customer:</span>
                      <span className="text-sm">{order.customerFullname}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Email:</span>
                      <span className="text-sm">{order.customerEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Date:</span>
                      <span className="text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}{" "}
                        {new Date(order.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Total:</span>
                      <span className="text-sm font-bold text-yellow-500">
                        ${order.total}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
