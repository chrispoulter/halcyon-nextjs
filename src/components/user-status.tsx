import { Role, roleDetails } from '@/app/user/actions/user-definitions';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type UserStatusProps = {
    user: {
        isLockedOut?: boolean;
        roles?: Role[];
    };
    className?: string;
};

export function UserStatus({ user, className }: UserStatusProps) {
    if (!user.roles && !user.isLockedOut) {
        return null;
    }

    return (
        <div className={cn('flex flex-col gap-2 sm:flex-row', className)}>
            {user.isLockedOut && (
                <Badge variant="destructive" className="justify-center">
                    Locked
                </Badge>
            )}
            {user.roles?.map((role) => (
                <Badge key={role} className="justify-center">
                    {roleDetails[role].title}
                </Badge>
            ))}
        </div>
    );
}
