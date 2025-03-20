import Link from 'next/link';
import type { SearchUsersResponse } from '@/app/user/user-types';
import { Badge } from '@/components/ui/badge';
import { roles } from '@/lib/definitions';

type UserCardProps = {
    user: SearchUsersResponse['items'][number];
};

export function UserCard({ user }: UserCardProps) {
    return (
        <Link
            href={`/user/${user.id}`}
            className="focus-within:bg-accent hover:bg-accent block space-y-2 rounded-lg border p-4"
        >
            <div className="space-y-0.5">
                <div className="truncate text-base font-medium">
                    {user.firstName} {user.lastName}
                </div>
                <div className="text-muted-foreground truncate text-sm">
                    {user.emailAddress}
                </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
                {user.isLockedOut && (
                    <Badge variant="destructive" className="w-full sm:w-auto">
                        Locked
                    </Badge>
                )}
                {user.roles?.map((role) => (
                    <Badge
                        key={role}
                        variant="secondary"
                        className="w-full sm:w-auto"
                    >
                        {roles[role].title}
                    </Badge>
                ))}
            </div>
        </Link>
    );
}
