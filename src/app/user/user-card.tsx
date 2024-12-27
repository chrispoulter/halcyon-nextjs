import Link from 'next/link';
import type { SearchUsersItem } from '@/app/user/actions/user-definitions';
import { UserStatus } from '@/components/user-status';

type UserCardProps = {
    user: SearchUsersItem;
};

export function UserCard({ user }: UserCardProps) {
    return (
        <Link
            key={user.id}
            href={`/user/${user.id}`}
            className="block space-y-2 rounded-lg border p-3 transition-all focus-within:bg-accent hover:bg-accent"
        >
            <div className="truncate text-sm font-medium leading-tight">
                {user.firstName} {user.lastName}
            </div>
            <div className="truncate text-sm text-muted-foreground">
                {user.emailAddress}
            </div>
            <UserStatus user={user} />
        </Link>
    );
}
