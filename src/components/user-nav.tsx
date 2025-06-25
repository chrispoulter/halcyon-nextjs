'use client';

import Link from 'next/link';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { logoutAction } from '@/app/account/actions/logout-action';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import { ServerActionErrorMessage } from '@/components/server-action-error';
import { type SessionPayload, roleOptions } from '@/lib/definitions';

type UserNavProps = {
    session?: SessionPayload;
};

export function UserNav({ session }: UserNavProps) {
    const { execute: logout, isPending: isSaving } = useAction(logoutAction, {
        onError({ error }) {
            toast.error(<ServerActionErrorMessage result={error} />);
        },
    });

    function onLogout() {
        logout();
    }

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
                <Button variant="outline" size="icon" className="rounded-full">
                    <Avatar>
                        <AvatarFallback>
                            {session.given_name[0]}
                            {session.family_name[0]}
                        </AvatarFallback>
                    </Avatar>
                    <span className="sr-only">Toggle profile menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel className="space-y-2">
                    <div className="space-y-0.5">
                        <div className="truncate text-sm font-medium">
                            {session.given_name} {session.family_name}
                        </div>
                        <div className="text-muted-foreground truncate text-sm">
                            {session.email}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        {session.roles?.map((role) => (
                            <Badge
                                key={role}
                                variant="secondary"
                                className="w-full"
                            >
                                {roleOptions[role].title}
                            </Badge>
                        ))}
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                    <Link href="/profile">My Account</Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={onLogout} disabled={isSaving}>
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
