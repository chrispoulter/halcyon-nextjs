import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { isAuthorized, Role } from '@/lib/auth';
import { config as libConfig } from '@/lib/config';

const protectedRoutes = [
    {
        path: '/user',
        roles: [Role.SYSTEM_ADMINISTRATOR, Role.USER_ADMINISTRATOR]
    }
];

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: libConfig.NEXTAUTH_SECRET });

    if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    const matchedRoute = protectedRoutes.find(route =>
        req.nextUrl.pathname.startsWith(route.path)
    );

    if (!matchedRoute) {
        return NextResponse.next();
    }

    if (!isAuthorized(token, matchedRoute.roles)) {
        return NextResponse.rewrite(new URL('/403', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/user/:path*',
        '/my-account/:path*',
        '/update-profile/:path*',
        '/change-password/:path*'
    ]
};
