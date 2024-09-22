import Link from 'next/link';
import { NavbarMenu } from '@/components/navbar-menu';
import { ProfileDropdown } from '@/components/profile-dropdown';

export const Header = () => (
    <header className="mb-3 bg-zinc-800">
        <nav className="container mx-auto flex max-w-screen-md flex-wrap items-center justify-between gap-2 p-1">
            <Link
                href="/"
                className="p-2 text-xl font-light leading-normal text-gray-100 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
                Halcyon
            </Link>
            <ProfileDropdown />
            <NavbarMenu />
        </nav>
    </header>
);
