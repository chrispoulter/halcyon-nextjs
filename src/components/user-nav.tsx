'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type SessionPayload, roles } from '@/lib/session-types';
import { UserAvatar } from './user-avatar';

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
                <DropdownMenuLabel className="space-y-2">
                    <div className="space-y-0.5">
                        <div className="truncate text-sm font-medium">
                            {session.firstName} {session.lastName}
                        </div>
                        <div className="truncate text-sm text-muted-foreground">
                            {session.emailAddress}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        {session.roles?.map((role) => (
                            <Badge
                                key={role}
                                variant="secondary"
                                className="justify-center"
                            >
                                {roles[role].title}
                            </Badge>
                        ))}
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                    <Link href="/profile">My Account</Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={onLogout}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
