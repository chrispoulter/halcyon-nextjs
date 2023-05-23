import { IncomingMessage } from 'http';
import { NextApiRequestCookies } from 'next/dist/server/api-utils';

export const getBaseUrl = (
    req: IncomingMessage & {
        cookies: NextApiRequestCookies;
    }
) => {
    const protocol = req.headers.referer?.split('://')[0] || 'http';
    const host = req.headers.host;
    return `${protocol}://${host}`;
};
