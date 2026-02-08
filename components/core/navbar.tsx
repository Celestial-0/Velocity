"use client"

import Link from "next/link";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { NetworkToggle } from "@/components/network-toggle"
import { Button } from "@/components/ui/button"
import { GithubIcon } from "@/components/icon";
import { Velocity } from "@/components/icon/velocity";

export function Navbar() {
    return (
        <div className="flex items-center justify-between px-4 py-2 border-b">
            <div className="flex items-center">
                <Link href="/" className="flex items-center gap-2 font-bold mr-6">
                    <Velocity className="w-8 h-8" />
                    <span className="hidden md:inline text-xl">Velocity</span>
                </Link>
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuLink href="/how-it-works" className={navigationMenuTriggerStyle()}>
                                How it works
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.open('https://github.com/Celestial-0/velocity', '_blank', 'noopener,noreferrer')}
                    aria-label="View on GitHub"
                >
                    <GithubIcon size={20} />
                </Button>
                <NetworkToggle />
                <ThemeToggle />
            </div>
        </div>
    )
}
