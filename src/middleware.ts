import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { isAuthorized, isUserAdministrator } from '@/lib/roles';

const protectedRoutes = [
    {
        path: '/user',
        roles: isUserAdministrator
    }
];

export default auth(req => {
    const user = req.auth?.user;

    if (!user) {
        return NextResponse.redirect(new URL('/login', req.nextUrl.origin));
    }

    const matchedRoute = protectedRoutes.find(route =>
        req.nextUrl.pathname.startsWith(route.path)
    );

    if (!matchedRoute) {
        return NextResponse.next();
    }

    if (!isAuthorized(user, matchedRoute.roles)) {
        return NextResponse.rewrite(new URL('/403', req.nextUrl.origin));
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        '/user/:path*',
        '/my-account/:path*',
        '/update-profile/:path*',
        '/change-password/:path*'
    ]
};
