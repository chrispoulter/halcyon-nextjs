'use client';

import Link from 'next/link';
import { createHash } from 'crypto';
import { Role, roleDetails } from '@/app/user/user-types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import type { SessionPayload } from '@/lib/session-types';

type ProfileDropdownProps = {
    session?: SessionPayload;
    onLogout: () => void;
};

export function ProfileDropdown({ session, onLogout }: ProfileDropdownProps) {
    if (!session) {
        return (
            <Button asChild variant="secondary">
                <Link href="/account/login">Login</Link>
            </Button>
        );
    }

    const hashedEmail = createHash('sha256')
        .update(session.emailAddress.trim().toLowerCase())
        .digest('hex');

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 w-10 rounded-full">
                    <Avatar>
                        <AvatarImage
                            src={`https://www.gravatar.com/avatar/${hashedEmail}?d=404`}
                            alt={`${session.firstName} ${session.lastName}`}
                        />
                        <AvatarFallback>{`${session.firstName[0]} ${session.lastName[0]}`}</AvatarFallback>
                    </Avatar>
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
                    <div className="flex flex-col gap-2">
                        {session.roles?.map((role) => (
                            <Badge key={role} className="justify-center">
                                {roleDetails[role as Role].title}
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
