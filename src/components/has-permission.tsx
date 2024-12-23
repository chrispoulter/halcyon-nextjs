import { Role, SessionPayload } from '@/lib/definitions';

type HasPermissionProps = {
    session: SessionPayload;
    requiredRoles: Role[];
    children: React.ReactNode;
};

export function HasPersmission({
    session,
    requiredRoles,
    children,
}: HasPermissionProps) {
    const hasPermission = requiredRoles.some((value) =>
        session.roles?.includes(value)
    );

    return hasPermission ? children : null;
}
