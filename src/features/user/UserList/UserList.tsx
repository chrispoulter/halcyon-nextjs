import { GetUserResponse } from '@/models/user.types';
import { UserCard } from '@/features/user/UserCard/UserCard';
import { BodyLink } from '@/components/BodyLink/BodyLink';

type UserListProps = {
    isLoading?: boolean;
    users?: GetUserResponse[];
};

const UserListLoading = () => (
    <div role="status" className="mb-3 flex animate-pulse flex-col gap-2">
        {[...Array(5)].map((_, index) => (
            <UserCard key={index} />
        ))}
        <span className="sr-only">Loading...</span>
    </div>
);

const UserListEmpty = () => (
    <div className="border border-dashed bg-gray-50 px-5 py-24 text-center font-normal text-gray-500">
        No users could be found.
        <br />
        <BodyLink href="/user/create">Create a new user?</BodyLink>
    </div>
);

export const UserList = ({ isLoading, users }: UserListProps) => {
    if (isLoading) {
        return <UserListLoading />;
    }

    if (!users?.length) {
        return <UserListEmpty />;
    }

    return (
        <div className="mb-3 flex flex-col gap-2">
            {users.map(user => (
                <UserCard key={user.id} user={user} />
            ))}
        </div>
    );
};
