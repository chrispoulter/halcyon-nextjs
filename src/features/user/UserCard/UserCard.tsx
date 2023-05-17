import Link from 'next/link';
import { GetUserResponse } from '@/models/user.types';
import { Badge } from '@/components/Badge/Badge';
import { roles } from '@/utils/auth';

type UserCardProps = {
    user?: GetUserResponse;
};

export const UserCard = ({ user }: UserCardProps) => {
    if (!user) {
        return (
            <div className="border p-5">
                <div className="w-full">
                    <div className="mb-2 h-6 w-4/12 bg-gray-200" />
                    <div className="h-5 w-6/12 bg-gray-100" />
                </div>
            </div>
        );
    }

    return (
        <Link
            href={`/user/${user.id}`}
            className="block border p-5 hover:outline hover:outline-1 hover:outline-offset-1 hover:outline-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
        >
            <h2 className="line-clamp-2 break-words text-lg font-light leading-tight text-gray-900">
                {user.firstName} {user.lastName}
                <br />
                <small className="text-base text-gray-500">
                    {user.emailAddress}
                </small>
            </h2>
            {(user.isLockedOut || (user.roles && user.roles.length > 0)) && (
                <div className="mt-3 flex flex-col flex-wrap gap-1 sm:flex-row">
                    {user.isLockedOut && <Badge variant="danger">Locked</Badge>}
                    {user.roles?.map(role => (
                        <Badge key={role}>{roles[role].title}</Badge>
                    ))}
                </div>
            )}
        </Link>
    );
};
