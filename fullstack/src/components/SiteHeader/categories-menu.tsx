import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useRouter } from "nextjs-toploader/app";

const categories = [
  "Creatures",
  "Cursed Items",
  "Ingredients",
  "Magic Items",
  "Scrolls",
  "Spell Books",
  "Staffs",
  "Wands",
];

const CategoriesDropdownMenu = () => {
  const router = useRouter();
  // Utility function to convert category to camelCase
  const formatCategory = (category: string) => {
    const words = category.split(" ");
    if (words.length === 2) {
      return words[0].toLowerCase() + words[1];
    }
    return words[0].toLowerCase();
  };

  return (
    <div className="hidden md:flex mx-4">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="flex flex-col gap-2 m-1 mx-2 text-nowrap">
                {categories.map((category, index) => (
                  <li
                    onClick={() => {
                      const formattedCategory = formatCategory(category);
                      router.push(`/category/${formattedCategory}`);
                    }}
                    style={{ cursor: "pointer" }}
                    key={index}
                    className="rounded-lg p-8 py-4 transition duration-300 hover:bg-black hover:text-white cursor-pointer"
                  >
                    <NavigationMenuLink>{category}</NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default CategoriesDropdownMenu;
