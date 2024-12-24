import { Role, SessionPayload } from '@/lib/definitions';

type HasPermissionProps = {
    session?: SessionPayload;
    requiredRoles: Role[];
    children: React.ReactNode;
};

export function HasPermission({
    session,
    requiredRoles,
    children,
}: HasPermissionProps) {
    if (!session) {
        return null;
    }

    const hasPermission = requiredRoles.some((value) =>
        session.roles?.includes(value)
    );

    return hasPermission ? children : null;
}
