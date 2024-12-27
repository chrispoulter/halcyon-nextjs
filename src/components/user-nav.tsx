'use client';

import Link from 'next/link';
import { User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserAvatar } from '@/components/user-avatar';
import { UserStatus } from '@/components/user-status';
import type { SessionPayload } from '@/lib/session-types';

type UserNavProps = {
    session?: SessionPayload;
    onLogout: () => void;
};

export function UserNav({ session, onLogout }: UserNavProps) {
    if (!session) {
        return (
            <Button asChild variant="secondary">
                <Link href="/account/login">Login</Link>
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 w-10 rounded-full">
                    <UserAvatar session={session} />
                    <span className="sr-only">Toggle profile menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel className="flex flex-col gap-2">
                    <div className="truncate text-sm font-medium leading-tight">
                        {session.firstName} {session.lastName}
                    </div>
                    <div className="truncate text-sm text-muted-foreground">
                        {session.emailAddress}
                    </div>
                    <UserStatus user={session} className="sm:flex-col" />
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                    <Link href="/profile">
                        <User />
                        <span>My Account</span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={onLogout}>
                    <LogOut />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
