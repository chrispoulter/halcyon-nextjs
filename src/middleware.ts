import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export default async function middleware(req: NextRequest) {
    const session = await getSession();

    if (!session) {
        return NextResponse.redirect(new URL('/account/login', req.nextUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/profile/:path*', '/user/:path*'],
};
