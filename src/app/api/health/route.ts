import { NextResponse } from 'next/server';
import { config } from '@/lib/config';

import { check as checkDatabase } from '@/db';
import { check as checkMailer } from '@/lib/mailer';

export async function GET() {
    const services = await Promise.all([checkDatabase(), checkMailer()]);
    const failing = services.some((s) => s.status !== 'ok');

    return NextResponse.json(
        {
            status: failing ? 'unhealthy' : 'ok',
            version: config.APP_VERSION,
            uptime: process.uptime(),
            services,
        },
        { status: failing ? 503 : 200 }
    );
}
