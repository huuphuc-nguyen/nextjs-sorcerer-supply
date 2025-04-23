"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getCategory } from "@/lib/firebase/getCategory";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListFilter } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { ProductCard } from "@/components/ProductCard/product-card";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase/config";
import { getUserFromDatabase } from "@/lib/firebase/users";

type Product = {
  name: string;
  price: number;
  id?: string;
  imageSrc?: string;
  collectionName?: string;
};

export default function SellerDashboard() {
  const router = useRouter();

  // Products
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Orders
  const [filteredOrders, setFilteredOrders] = useState<AdminOrder[]>([]);
  const [isOrdersLoading, setOrdersLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"ascending" | "descending">(
    "descending",
  );
  const [categoryToSort, setCategoryToSort] = useState<
    "date" | "customer" | "total"
  >("date");

  // User's data
  const [fullName, setFullName] = useState<string>("New Customer");
  const [avatar, setAvatar] = useState<string>("/avatar_placeholder.png");

  const fetchOrders = async () => {
    try {
      const orders = await getAllOrdersFromDatabase();
      setFilteredOrders(
        orders.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
      );
    } catch (error) {
      console.error(error);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Fetch users when page is loaded
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setFullName(user.displayName || "New Customer");
        if (user.photoURL) {
          setAvatar(user.photoURL);
        }
        getUserFromDatabase(user.uid).then((user) => {
          setFullName(user?.fullname || "New Customer");
          console.log("User:", user);
        });
      } else {
        router.replace("/login");
      }
    });
  }, []);

  // Fetch orders when page is loaded
  useEffect(() => {
    setOrdersLoading(true);
    fetchOrders()
      .then(() => setOrdersLoading(false))
      .catch((error) => {
        console.error(error);
        setOrdersLoading(false);
      });
  }, []);

  // Sort/filter whenever sortBy or categoryToSort changes
  useEffect(() => {
    setFilteredOrders((prev) =>
      [...prev].sort((a, b) => {
        const dir = sortBy === "ascending" ? 1 : -1;
        if (categoryToSort === "date") {
          return (
            dir *
            (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
          );
        }
        if (categoryToSort === "customer") {
          return dir * a.customerFullname.localeCompare(b.customerFullname);
        }
        return dir * (a.total - b.total);
      }),
    );
  }, [sortBy, categoryToSort]);

  // Fetch products once
  useEffect(() => {
    (async () => {
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
        const all: Product[] = [];
        for (const cat of categories) {
          const items = await getCategory(cat);
          all.push(
            ...items.map(
              (p: {
                id: string;
                name: string;
                price: number;
                imageSrc?: string;
              }) => ({
                id: p.id,
                name: p.name,
                price: p.price,
                imageSrc: p.imageSrc,
                collectionName: cat,
              }),
            ),
          );
        }
        setProducts(all);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleStatusChange = async (order: AdminOrder, status: string) => {
    try {
      await updateOrderStatus(order.userId, order.id, status);
      toast({
        title: "Success",
        variant: "success",
        description: `Order ${order.id} status updated to ${status}`,
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Error",
        variant: "destructive",
        description: "Failed to update order status.",
      });
    }

    // re-fetch orders (or optimistically update local state)
    fetchOrders();
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
          <Link href="#" className="hover:underline">
            Discounts
          </Link>
          <Link href="/" className="hover:underline">
            Back to Store
          </Link>
        </div>
      </nav>

      {/* Profile */}
      <div className="bg-zinc-900 p-6 rounded-xl shadow-md flex items-center mb-6">
        <Image
          src={avatar}
          alt="Seller Profile"
          width={80}
          height={80}
          className="rounded-full border-2 border-gray-700"
        />
        <div className="ml-4">
          <h2 className="text-xl font-bold">{fullName}</h2>
          <p className="text-gray-400">Enchanted Goods Seller</p>
        </div>
      </div>

      {/* Products */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold mb-4">Products</h2>
        {/* Add Product Button */}
        <button
          onClick={() => router.push("/addItems")}
          className="bg-green-600 hover:bg-green-700 w-28 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200"
        >
          Add Item
        </button>
      </div>
      {loading ? (
        <p className="text-gray-400">Loading products...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-10 place-items-center">
          {products.map((p) => (
            <div
              key={p.id}
              onClick={() =>
                router.push(`/modifyItems/${p.collectionName}/${p.id}`)
              }
              className="cursor-pointer"
            >
              <ProductCard
                name={p.name}
                price={p.price}
                imageSrc={p.imageSrc}
              />
            </div>
          ))}
        </div>
      )}

      {/* Orders */}
      <div className="flex justify-between items-center mt-6">
        <h2 className="text-md md:text-lg font-semibold">Order History</h2>
        <div className="flex gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="hidden md:flex items-center font-bold gap-2">
              Order By <ListFilter />
            </span>
            <Select
              value={sortBy}
              onValueChange={(v: "ascending" | "descending") => setSortBy(v)}
            >
              <SelectTrigger className="w-[150px]">
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
            <span className="hidden md:flex items-center font-bold gap-2">
              Sort by <ListFilter />
            </span>
            <Select
              value={categoryToSort}
              onValueChange={(v: string) =>
                setCategoryToSort(v as "date" | "customer" | "total")
              }
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sort By</SelectLabel>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="customer">Customer’s name</SelectItem>
                  <SelectItem value="total">Total purchased</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {isOrdersLoading ? (
        <p className="text-gray-400 mt-4">Loading orders...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {filteredOrders.map((order) => (
            <Link href={`/order/${order.userId}/${order.id}`} key={order.id}>
              <Card className="bg-gray-900 border-gray-700 text-white rounded-lg p-2 shadow-lg">
                <CardHeader className="border-b border-gray-700 pb-4">
                  <CardTitle className="text-xl font-semibold flex justify-between flex-wrap">
                    <span>#{order.id}</span>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 w-[100px] text-center ease-in-out ${
                        order.status === "pending"
                          ? "bg-yellow-500"
                          : order.status === "complete"
                            ? "bg-green-500"
                            : "bg-red-500"
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 mt-4">
                  {/* Status selector */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Status:</span>
                    <Select
                      value={order.status}
                      onValueChange={(v: string) =>
                        handleStatusChange(order, v)
                      }
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Change status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Status</SelectLabel>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="complete">Complete</SelectItem>
                          <SelectItem value="cancel">Cancel</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Other details */}
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
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}