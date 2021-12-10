import { logger } from '../utils/logger';

export const errorMiddleware = (err, _, res, __) => {
    logger.error(err);

    return res.status(500).json({
        code: 'INTERNAL_SERVER_ERROR',
        message: err.message
    });
};
