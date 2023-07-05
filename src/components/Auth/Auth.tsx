import { useSession } from 'next-auth/react';
import { PageSkeleton } from '@/components/Skeleton/Skeleton';
import Forbidden from '@/pages/403';
import { Role, isAuthorized } from '@/utils/auth';

type AuthProps = React.PropsWithChildren<{
    auth: boolean | Role[];
}>;

export const Auth = ({ auth, children }: AuthProps) => {
    const { data: session, status } = useSession({ required: true });

    if (status === 'loading') {
        return <PageSkeleton />;
    }

    if (auth instanceof Array && !isAuthorized(session?.user, auth)) {
        return <Forbidden />;
    }

    return <>{children}</>;
};
