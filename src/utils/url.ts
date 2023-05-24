import { IncomingMessage } from 'http';

export const getBaseUrl = (req: IncomingMessage) => {
    const protocol = req.headers.referer?.split('://')[0] || 'http';
    const host = req.headers.host;
    return `${protocol}://${host}`;
};
