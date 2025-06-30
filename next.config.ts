import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    output: 'standalone',
    env: {
        VERSION:
            process.env.VERCEL_DEPLOYMENT_ID || process.env.npm_package_version,
    },
    experimental: {
        authInterrupts: true,
    },
};

export default nextConfig;
