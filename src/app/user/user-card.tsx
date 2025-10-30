import Link from 'next/link';
import type { SearchUsersResponse } from '@/app/user/data/search-users';
import { Badge } from '@/components/ui/badge';
import {
    Item,
    ItemContent,
    ItemDescription,
    ItemFooter,
    ItemTitle,
} from '@/components/ui/item';
import { roleOptions } from '@/lib/definitions';

type UserCardProps = {
    user: SearchUsersResponse['items'][number];
};

export function UserCard({ user }: UserCardProps) {
    return (
        <Item variant="outline" asChild>
            <Link href={`/user/${user.id}`}>
                <ItemContent>
                    <ItemTitle>
                        {user.firstName} {user.lastName}
                    </ItemTitle>
                    <ItemDescription>{user.emailAddress}</ItemDescription>
                </ItemContent>
                <ItemFooter className="flex flex-col justify-start gap-2 sm:flex-row">
                    {user.isLockedOut && (
                        <Badge
                            variant="destructive"
                            className="w-full sm:w-auto"
                        >
                            Locked
                        </Badge>
                    )}
                    {user.roles?.map((role) => (
                        <Badge
                            key={role}
                            variant="secondary"
                            className="w-full sm:w-auto"
                        >
                            {roleOptions[role].title}
                        </Badge>
                    ))}
                </ItemFooter>
            </Link>
        </Item>
    );
}
