import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    output: 'standalone',
    env: {
        npm_package_name: process.env.npm_package_name,
        npm_package_version: process.env.npm_package_version,
    },
    experimental: {
        authInterrupts: true,
    },
    images: {
        domains: ['www.gravatar.com'],
    },
};

export default nextConfig;
