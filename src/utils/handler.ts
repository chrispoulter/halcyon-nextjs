import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import * as Yup from 'yup';
import { HandlerResponse } from '@/models/base.types';
import { Role, isAuthorized } from '@/utils/auth';
import { config } from '@/utils/config';

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
                const token = await getToken({
                    req,
                    secret: config.NEXTAUTH_SECRET
                });

                if (!token) {
                    throw new HandlerError(401);
                }

                if (options.auth instanceof Array) {
                    const authorized = isAuthorized(token, options.auth);

                    if (!authorized) {
                        throw new HandlerError(403);
                    }
                }

                context.currentUserId = parseInt(token.sub!);
            }

            await handler(req, res, context);
        } catch (error) {
            if (error instanceof HandlerError) {
                return res.status(error.status).end();
            }

            if (error instanceof Yup.ValidationError) {
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
