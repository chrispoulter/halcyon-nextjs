import type { NextConfig } from 'next';

const gitCommitSha =
    process.env.VITE_VERCEL_GIT_COMMIT_SHA ||
    process.env.GIT_COMMIT_SHA ||
    undefined;

const version = gitCommitSha?.slice(0, 7) ?? process.env.npm_package_version;

const nextConfig: NextConfig = {
    output: 'standalone',
    outputFileTracingIncludes: {
        '/*': ['./drizzle/**'],
    },
    env: {
        APP_VERSION: version,
    },
    experimental: {
        authInterrupts: true,
    },
};

export default nextConfig;
