import Link from 'next/link';
import type { SearchUsersResponse } from '@/app/user/user-types';
import { Badge } from '@/components/ui/badge';
import { roles } from '@/lib/session-types';

type UserCardProps = {
    user: SearchUsersResponse['items'][number];
};

export function UserCard({ user }: UserCardProps) {
    return (
        <Link
            href={`/user/${user.id}`}
            className="block space-y-2 rounded-lg border p-4 focus-within:bg-accent hover:bg-accent"
        >
            <div className="space-y-0.5">
                <div className="truncate text-base font-medium">
                    {user.firstName} {user.lastName}
                </div>
                <div className="truncate text-sm text-muted-foreground">
                    {user.emailAddress}
                </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
                {user.isLockedOut && (
                    <Badge variant="destructive" className="justify-center">
                        Locked
                    </Badge>
                )}
                {user.roles?.map((role) => (
                    <Badge
                        key={role}
                        variant="secondary"
                        className="justify-center"
                    >
                        {roles[role].title}
                    </Badge>
                ))}
            </div>
        </Link>
    );
}
