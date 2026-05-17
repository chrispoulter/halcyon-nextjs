'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import {
    type SessionPayload,
    type Role,
    isUserAdministrator,
} from '@/lib/types';

type NavItem = { href: string; label: string; roles?: Role[] };

const navItems: NavItem[] = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    {
        href: '/users',
        label: 'Users',
        roles: isUserAdministrator,
    },
];

type MainMenuProps = {
    session?: SessionPayload;
};

export function MainMenu({ session }: MainMenuProps) {
    const [open, setOpen] = useState(false);

    const navLinks = navItems
        .filter(
            ({ roles }) =>
                !roles || roles.some((value) => session?.roles?.includes(value))
        )
        .map(({ href, label }) => (
            <Button key={href} asChild variant="ghost">
                <Link href={href} onClick={() => setOpen(false)}>
                    {label}
                </Link>
            </Button>
        ));

    return (
        <>
            <nav className="hidden gap-2 sm:flex">{navLinks}</nav>
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                    <Button variant="outline" size="icon" className="sm:hidden">
                        <Menu />
                        <span className="sr-only">Toggle main menu</span>
                    </Button>
                </DrawerTrigger>
                <DrawerContent>
                    <div className="mx-auto w-full max-w-sm">
                        <DrawerHeader className="sr-only">
                            <DrawerTitle>Halcyon</DrawerTitle>
                            <DrawerDescription>Main Menu</DrawerDescription>
                        </DrawerHeader>
                        <nav className="flex flex-col items-stretch justify-center gap-2 p-4">
                            {navLinks}
                        </nav>
                    </div>
                </DrawerContent>
            </Drawer>
        </>
    );
}
