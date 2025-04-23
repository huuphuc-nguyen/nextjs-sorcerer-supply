import Link from "next/link";
import { Dispatch, MouseEventHandler, SetStateAction } from "react";
import {
  ShoppingCart,
  Search,
  WandSparkles,
  User,
  LayoutDashboard,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CategoriesDropdownMenu from "./categories-menu";

interface SiteHeaderProps {
  authenticated?: boolean | null;
  setSearchText: Dispatch<SetStateAction<string>>;
  onAuthClicked?: MouseEventHandler<HTMLButtonElement>;
  onSearchClicked?: () => void;
  onCartClicked?: MouseEventHandler<HTMLButtonElement>;
  onAccountClicked?: MouseEventHandler<HTMLButtonElement>;
  onDashboardClicked?: MouseEventHandler<HTMLButtonElement>;
}

export function SiteHeader({
  authenticated,
  setSearchText,
  onAuthClicked,
  onSearchClicked,
  onCartClicked,
  onAccountClicked,
  onDashboardClicked,
}: SiteHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border-b border-gray-800 gap-4">
      {/* Left Side: Logo + Category */}
      <div className="flex items-center justify-between w-full md:w-auto gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-white text-lg"
        >
          <WandSparkles className="text-indigo-400" />
          SORCERER&apos;S SUPPLY
        </Link>

        {/* Categories Dropdown - visible on md+ */}
        <div className="hidden md:block">
          <CategoriesDropdownMenu />
        </div>
      </div>

      {/* Middle: Search */}
      <div className="flex items-center gap-2 w-full md:w-auto">
        <Input
          placeholder="Search products"
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSearchClicked?.();
          }}
          className="w-full md:w-[300px]"
        />
        <Button variant="outline" size="icon" onClick={onSearchClicked}>
          <Search />
        </Button>
      </div>

      {/* Right: Actions */}
      <div className="flex flex-wrap justify-end gap-2 md:gap-4 w-full md:w-auto">
        <Button onClick={onAuthClicked}>
          {authenticated === null
            ? "..."
            : authenticated
              ? "Sign out"
              : "Log in"}
        </Button>

        {/* Hide some actions on small screens */}
        <Button onClick={onAccountClicked} className="sm:flex">
          <User className="mr-1" />{" "}
          <span className="hidden sm:flex">Account</span>
        </Button>

        <Button onClick={onDashboardClicked} className="sm:flex">
          <LayoutDashboard className="mr-1" />{" "}
          <span className="hidden sm:flex">Dashboard</span>
        </Button>

        <Button onClick={onCartClicked}>
          <ShoppingCart className="mr-1" />{" "}
          <span className="hidden sm:flex">Cart</span>
        </Button>
      </div>
    </div>
  );
}
