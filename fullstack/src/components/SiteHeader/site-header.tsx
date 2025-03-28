import Link from 'next/link';
import { MouseEventHandler } from 'react';
import { ShoppingCart, Search, WandSparkles, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import CategoriesDropdownMenu from './categories-menu';

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
                
                {/* Logo */}
                <WandSparkles/>
                <Link href={"/"}>SORCERER&apos;S SUPPLY</Link>

                {/* Categories Dropdown Menu */}
                <CategoriesDropdownMenu/>
                
            </div>

            <div className="flex items-center gap-4 ml-auto">

                {/* Search Bar */}
                <div className="flex items-center gap-2">
                    <Input placeholder="Search products"></Input>
                    <Button variant="outline" size="icon" onClick={onSearchClicked}>
                        <Search/>
                    </Button>
                </div>

                {/* Buttons */}
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