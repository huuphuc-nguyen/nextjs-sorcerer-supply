import Link from 'next/link';
import { MouseEventHandler } from 'react';
import { ShoppingCart, Search, WandSparkles, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
  } from "@/components/ui/navigation-menu"

interface SiteHeaderProps {
    authenticated?: boolean | null,
    onAuthClicked?: MouseEventHandler<HTMLButtonElement>,
    onSearchClicked?: MouseEventHandler<HTMLButtonElement>,
    onCartClicked?: MouseEventHandler<HTMLButtonElement>
    onAccountClicked?: MouseEventHandler<HTMLButtonElement>
}

export function SiteHeader({authenticated, onAuthClicked, onSearchClicked, onCartClicked, onAccountClicked} : SiteHeaderProps) {
    return (
        <div className="flex p-4 border-b border-gray-800">
            <div className="flex items-center gap-2">
                <WandSparkles/>
                <Link href={"/"}>SORCERER&apos;S SUPPLY</Link>
                <p>SORCERER&apos;S SUPPLY</p>
                <div className='hidden md:flex'>
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className='flex flex-col gap-2 m-1 mx-2 text-nowrap'>
                                        <li><NavigationMenuLink>Creatures</NavigationMenuLink></li>
                                        <li><NavigationMenuLink>Cursed Items</NavigationMenuLink></li>
                                        <li><NavigationMenuLink>Ingredients</NavigationMenuLink></li>
                                        <li><NavigationMenuLink>Magic Items</NavigationMenuLink></li>
                                        <li><NavigationMenuLink>Scrolls</NavigationMenuLink></li>
                                        <li><NavigationMenuLink>Spell Books</NavigationMenuLink></li>
                                        <li><NavigationMenuLink>Staffs</NavigationMenuLink></li>
                                        <li><NavigationMenuLink>Wands</NavigationMenuLink></li>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Brands</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className='flex flex-col gap-2 m-1 mx-2 text-nowrap'>
                                        <li><NavigationMenuLink>List of brands here</NavigationMenuLink></li> {/* TODO */}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
            </div>
            <div className="flex items-center gap-4 ml-auto">
                <div className="flex items-center gap-2">
                    <Input placeholder="Search products"></Input>
                    <Button variant="outline" size="icon" onClick={onSearchClicked}>
                        <Search/>
                    </Button>
                </div>
                <Button onClick={onAuthClicked}>
                    {authenticated === null ? '...' : authenticated ? 'Sign out' : 'Log in'}
                </Button>
                <Button onClick={onAccountClicked}>
                    <User/> Account
                </Button>
                <Button onClick={onCartClicked}>
                    <ShoppingCart/> Cart
                </Button>
            </div>
        </div>
    );
}