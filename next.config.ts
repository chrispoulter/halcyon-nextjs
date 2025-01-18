import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    output: 'standalone',
    experimental: {
        authInterrupts: true,
    },
    images: {
        domains: ['www.gravatar.com'],
    },
};

export default nextConfig;
