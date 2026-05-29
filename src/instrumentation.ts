import { registerOTel } from '@vercel/otel';

export async function register() {
    registerOTel({ serviceName: 'halcyon-nextjs' });
}
