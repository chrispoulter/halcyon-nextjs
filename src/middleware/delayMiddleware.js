import { config } from '@/utils/config';

export const delayMiddleware = async (_, __, next) => {
    if (config.API_DELAY) {
        await new Promise(resolve => setTimeout(resolve, config.API_DELAY));
    }

    return await next();
};
