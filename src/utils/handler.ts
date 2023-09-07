import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { ValidationError } from 'yup';
import { HandlerResponse } from '@/models/base.types';
import { verifyToken } from '@/utils/jwt';
import { Role, isAuthorized } from '@/utils/auth';

type HandlerContext = {
    currentUserId?: number;
};

export type Handler<TResponse = unknown> = (
    req: NextApiRequest,
    res: NextApiResponse<HandlerResponse<TResponse>>,
    context: HandlerContext
) => unknown | Promise<unknown>;

type HandlerConfig = {
    [key: string]: Handler;
};

type HandlerOptions = {
    auth?: boolean | Role[];
};

class HandlerError extends Error {
    status: number;

    constructor(status: number) {
        super('An error has occurred.');
        this.name = 'HandlerError';
        this.status = status;
    }
}

export const handler =
    (handlers: HandlerConfig, options?: HandlerOptions): NextApiHandler =>
    async (req, res) => {
        try {
            const method = (req.method || 'GET').toLowerCase();

            const handler = handlers[method];

            if (!handler) {
                throw new HandlerError(405);
            }

            const context: HandlerContext = {};

            if (options?.auth) {
                const authorization = (req.headers['authorization'] ||
                    req.headers['Authorization']) as string;

                const token = authorization?.replace(/bearer /giu, '');

                if (!token) {
                    throw new HandlerError(401);
                }

                const payload = verifyToken(token);

                if (!payload) {
                    throw new HandlerError(401);
                }

                if (options.auth instanceof Array) {
                    const authorized = isAuthorized(payload, options.auth);

                    if (!authorized) {
                        throw new HandlerError(403);
                    }
                }

                context.currentUserId = parseInt(payload.sub!);
            }

            await handler(req, res, context);
        } catch (error) {
            if (error instanceof HandlerError) {
                res.status(error.status).end();
                return;
            }

            if (error instanceof ValidationError) {
                return res.status(400).json({
                    code: 'INVALID_REQUEST',
                    message: 'Request is invalid.',
                    data: error.errors
                });
            }

            console.error('api error', error);

            return res.status(500).json({
                code: 'INTERNAL_SERVER_ERROR',
                message:
                    error instanceof Error
                        ? error.message
                        : 'An error has occurred.'
            });
        }
    };
