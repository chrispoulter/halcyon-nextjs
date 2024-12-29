import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Halcyon',
        short_name: 'Halcyon',
        description:
            'A Next.js web project template. Built with a sense of peace and tranquillity.',
        start_url: '/',
        display: 'standalone',
        background_color: '#020617',
        theme_color: '#020617',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    };
}
