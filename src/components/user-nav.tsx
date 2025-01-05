'use client';

import Link from 'next/link';
import { useAction } from 'next-safe-action/hooks';
import { logoutAction } from '@/app/account/actions/logout-action';
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
import { UserAvatar } from '@/components/user-avatar';
import { ServerActionErrorMessage } from '@/components/server-action-error';
import { toast } from '@/hooks/use-toast';
import { type SessionPayload, roles } from '@/lib/session-types';

type UserNavProps = {
    session?: SessionPayload;
};

export function UserNav({ session }: UserNavProps) {
    const { execute, isPending } = useAction(logoutAction, {
        onError: ({ error }) => {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: <ServerActionErrorMessage result={error} />,
            });
        },
    });

    function onLogout() {
        execute();
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
                <Button variant="ghost" className="h-10 w-10 rounded-full">
                    <UserAvatar session={session} />
                    <span className="sr-only">Toggle profile menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel className="space-y-2">
                    <div className="space-y-0.5">
                        <div className="truncate text-sm font-medium">
                            {session.given_name} {session.family_name}
                        </div>
                        <div className="truncate text-sm text-muted-foreground">
                            {session.email}
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

                <DropdownMenuItem onClick={onLogout} disabled={isPending}>
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
