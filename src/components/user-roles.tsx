import { Badge } from '@/components/ui/badge';
import { Role, roleDetails } from '@/lib/definitions';

type UserRolesProps = {
    roles?: Role[];
};

export function UserRoles({ roles }: UserRolesProps) {
    if (!roles) {
        return null;
    }

    return (
        <>
            {roles.map((role) => (
                <Badge
                    key={role}
                    variant="secondary"
                    className="justify-center"
                >
                    {roleDetails[role].title}
                </Badge>
            ))}
        </>
    );
}
