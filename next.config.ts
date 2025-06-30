import type { NextConfig } from 'next';
import packageJson from "./package.json";

const nextConfig: NextConfig = {
    output: 'standalone',
    env: {
        VERSION:
            packageJson.version,
    },
    experimental: {
        authInterrupts: true,
    },
};

export default nextConfig;
