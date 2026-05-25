import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/server-utils';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const siteUrl = await getSiteUrl();

    return [
        {
            url: siteUrl,
        },
    ];
}
