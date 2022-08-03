import nextConnect from 'next-connect';
import { httpLogger, logger } from './logger';

export const getHandler = () =>
    nextConnect({
        onError: (err, _, res, __) => {
            logger.error(err);

            return res.status(500).json({
                code: 'INTERNAL_SERVER_ERROR',
                message: err.message
            });
        },
        onNoMatch: (_, res) => res.status(404).end()
    }).use(httpLogger);
