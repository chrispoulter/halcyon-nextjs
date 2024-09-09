import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';
import { isAuthorized, isUserAdministrator } from '@/lib/roles';
import { config as libConfig } from '@/lib/config';

const protectedRoutes = [
    {
        path: '/user',
        roles: isUserAdministrator
    }
];

export default withAuth(
    req => {
        const matchedRoute = protectedRoutes.find(route =>
            req.nextUrl.pathname.startsWith(route.path)
        );

        if (!matchedRoute) {
            return NextResponse.next();
        }

        if (!isAuthorized(req.nextauth.token!, matchedRoute.roles)) {
            return NextResponse.rewrite(new URL('/403', req.url));
        }

        return NextResponse.next();
    },
    {
        secret: libConfig.NEXTAUTH_SECRET
    }
);

export const config = {
    matcher: [
        '/user/:path*',
        '/my-account/:path*',
        '/update-profile/:path*',
        '/change-password/:path*'
    ]
};
