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
import { Role, SessionPayload } from '@/lib/session-definitions';

const routes = [
    {
        href: '/',
        label: 'Home',
    },
    {
        href: '/about',
        label: 'About',
    },
    {
        href: '/user',
        label: 'Users',
        role: [Role.SYSTEM_ADMINISTRATOR, Role.USER_ADMINISTRATOR],
    },
];

type MainNavProps = {
    session?: SessionPayload;
};

export function MainNav({ session }: MainNavProps) {
    const routeLinks = routes
        .filter((route) =>
            route.role
                ? route.role.some((value) => session?.roles?.includes(value))
                : true
        )
        .map((route) => (
            <Button key={route.href} asChild variant="link">
                <Link href={route.href}>{route.label}</Link>
            </Button>
        ));

    return (
        <>
            <nav className="hidden gap-2 sm:flex">{routeLinks}</nav>
            <Drawer>
                <DrawerTrigger asChild>
                    <Button variant="outline" size="icon" className="sm:hidden">
                        <Menu />
                        <span className="sr-only">Toggle main menu</span>
                    </Button>
                </DrawerTrigger>
                <DrawerContent>
                    <div className="mx-auto w-full max-w-sm">
                        <DrawerHeader className="sr-only">
                            <DrawerTitle>Main Menu</DrawerTitle>
                            <DrawerDescription>
                                Main menu navigation links
                            </DrawerDescription>
                        </DrawerHeader>
                        <nav className="flex flex-col items-stretch justify-center gap-2 p-4">
                            {routeLinks}
                        </nav>
                    </div>
                </DrawerContent>
            </Drawer>
        </>
    );
}
