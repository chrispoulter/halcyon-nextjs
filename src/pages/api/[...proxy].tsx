import { createProxyMiddleware } from 'http-proxy-middleware';
import { config as utilConfig } from '@/utils/config';

const apiProxy = createProxyMiddleware({
    target: utilConfig.EXTERNAL_API_URL,
    secure: false,
    changeOrigin: true,
    pathRewrite: { '^/api': '' }
});

export const config = {
    api: {
        externalResolver: true,
        bodyParser: false
    }
};

export default apiProxy;
