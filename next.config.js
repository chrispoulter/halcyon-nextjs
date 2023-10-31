const proxyApiUrl = process.env.PROXY_API_URL;

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'standalone',
    async rewrites() {
        return [
            {
                source: '/api/account/:path*',
                destination: `${proxyApiUrl}/account/:path*`
            },
            {
                source: '/api/manage/:path*',
                destination: `${proxyApiUrl}/manage/:path*`
            },
            {
                source: '/api/token/:path*',
                destination: `${proxyApiUrl}/token/:path*`
            },
            {
                source: '/api/user/:path*',
                destination: `${proxyApiUrl}/user/:path*`
            }
        ];
    }
};

module.exports = nextConfig;
