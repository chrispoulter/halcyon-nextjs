import { createProxyMiddleware } from 'http-proxy-middleware';
import { config as utilConfig } from '@/utils/config';
import { logger } from '@/utils/logger';

const apiProxy = createProxyMiddleware({
    target: utilConfig.EXTERNAL_API_URL,
    secure: false,
    changeOrigin: true,
    pathRewrite: { '^/api': '' },
    logger
});

export const config = {
    api: {
        externalResolver: true,
        bodyParser: false
    }
};

export default apiProxy;
