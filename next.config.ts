import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    output: 'standalone',
    env: {
        APP_VERSION: process.env.npm_package_version,
    },
    experimental: {
        authInterrupts: true,
    },
};

export default nextConfig;
