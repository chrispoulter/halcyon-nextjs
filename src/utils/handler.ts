import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { ValidationError } from 'yup';
import { Role, isAuthorized } from '@/utils/auth';
import { config } from '@/utils/config';

type HandlerContext = {
    currentUserId?: number;
};

export type Handler<TResponse = unknown> = (
    req: NextApiRequest,
    res: NextApiResponse<TResponse>,
    context: HandlerContext
) => unknown | Promise<unknown>;

type HandlerConfig = {
    [key: string]: Handler;
};

type HandlerOptions = {
    authorize?: boolean | Role[];
};

class HandlerError extends Error {
    status: number;

    constructor(status: number) {
        super('An error occurred while processing your request.');
        this.name = 'HandlerError';
        this.status = status;
    }
}

export const mapHandlers =
    (handlers: HandlerConfig, options?: HandlerOptions): NextApiHandler =>
    async (req, res) => {
        try {
            const method = (req.method || 'GET').toLowerCase();

            const handler = handlers[method];

            if (!handler) {
                throw new HandlerError(405);
            }

            const context: HandlerContext = {};

            if (options?.authorize) {
                const token = await getToken({
                    req,
                    secret: config.NEXTAUTH_SECRET
                });

                if (!token) {
                    throw new HandlerError(401);
                }

                if (options.authorize instanceof Array) {
                    const authorized = isAuthorized(token, options.authorize);

                    if (!authorized) {
                        throw new HandlerError(403);
                    }
                }

                context.currentUserId = parseInt(token.sub!);
            }

            await handler(req, res, context);
        } catch (error) {
            if (error instanceof HandlerError) {
                res.status(error.status).end();
                return;
            }

            if (error instanceof ValidationError) {
                return res.status(400).json({
                    message: 'One or more validation errors occurred.',
                    errors: error.errors
                });
            }

            console.error('api error', error);

            return res.status(500).json({
                message:
                    error instanceof Error
                        ? error.message
                        : 'An error occurred while processing your request.'
            });
        }
    };
