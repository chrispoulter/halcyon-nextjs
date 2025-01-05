import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    output: 'standalone',
    images: {
        domains: ['www.gravatar.com'],
    },
};

export default nextConfig;
