import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    reactStrictMode: true,
    output: 'standalone',
    eslint: {
        dirs: ['src', 'e2e']
    }
};

export default nextConfig;
