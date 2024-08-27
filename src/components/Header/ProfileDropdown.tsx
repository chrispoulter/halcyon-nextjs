import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Badge } from '@/components/Badge/Badge';
import { roles } from '@/utils/auth';

export const ProfileDropdown = () => {
    const { data: session } = useSession();

    const user = session?.user;

    if (!user) {
        return null;
    }

    const onLogout = () => signOut({ callbackUrl: '/' });

    return (
        <Menu
            as="div"
            data-testid="profile-menu"
            className="relative ml-auto sm:order-2 sm:ml-0"
        >
            <MenuButton className="relative inline-flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border-2 border-gray-800 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-cyan-500">
                <span className="font-medium text-gray-900">
                    {user.name![0]}
                </span>
            </MenuButton>

            <MenuItems className="absolute right-0 z-10 mt-2 w-60 border bg-white shadow focus:outline-none">
                <MenuItem>
                    <div className="w-full px-5 py-3 text-left text-sm">
                        <div className="mb-1 line-clamp-1 break-words font-medium text-gray-800">
                            {user.name}
                        </div>
                        <div className="line-clamp-1 break-words font-light text-gray-500">
                            {user.email}
                        </div>
                        {user.roles && (
                            <div className="mt-3 flex flex-col gap-1">
                                {user.roles?.map(role => (
                                    <Badge key={role}>
                                        {roles[role].title}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>
                </MenuItem>
                <div className="my-1 border-b" />
                <MenuItem>
                    <Link
                        href="/my-account"
                        className="block w-full px-5 py-3 text-left text-sm text-gray-800 hover:bg-gray-200"
                    >
                        My Account
                    </Link>
                </MenuItem>
                <MenuItem>
                    <button
                        type="button"
                        onClick={onLogout}
                        className="block w-full px-5 py-3 text-left text-sm text-gray-800 hover:bg-gray-200"
                    >
                        Log Out
                    </button>
                </MenuItem>
            </MenuItems>
        </Menu>
    );
};
