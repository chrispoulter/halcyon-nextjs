import { NextResponse } from 'next/server';
import { config } from '@/lib/config';

export async function GET() {
    return NextResponse.json({
        status: 'ok',
        version: config.APP_VERSION,
        uptime: process.uptime(),
    });
}
