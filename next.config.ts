import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    output: 'standalone',
    env: {
        npm_package_version: process.env.npm_package_version,
    },
    experimental: {
        authInterrupts: true,
    },
};

export default nextConfig;
