import { Middleware, isRejectedWithValue } from '@reduxjs/toolkit';
import router from 'next/router';
import { signOut } from 'next-auth/react';
import toast from 'react-hot-toast';

const hasRTKQMeta = (
    action: any
): action is {
    type: string;
    meta: {
        baseQueryMeta: {
            request: Request;
            response?: Response;
        };
    };
    payload: {
        data?: {
            title?: string;
        };
    };
} => action?.meta?.baseQueryMeta?.request instanceof Request;

export const logger: Middleware = () => next => async action => {
    if (typeof window === 'undefined') {
        return next(action);
    }

    if (isRejectedWithValue(action) && hasRTKQMeta(action)) {
        const { request, response } = action.meta.baseQueryMeta;
        const method = request.method;
        const status = response?.status;
        const errorMessage = action.payload.data?.title;

        switch (method) {
            case 'GET':
                switch (status) {
                    case 401:
                        const result = await signOut({
                            redirect: false,
                            callbackUrl: '/'
                        });

                        return router.push(result.url);

                    case 403:
                        return router.push('/403', router.asPath);

                    case 404:
                        return router.push('/404', router.asPath);

                    default:
                        return router.push('/500', router.asPath);
                }

            default:
                switch (status) {
                    case 401:
                        const result = await signOut({
                            redirect: false,
                            callbackUrl: '/'
                        });

                        return router.push(result.url);

                    case 403:
                        return toast.error(
                            'Sorry, you do not have access to this resource.'
                        );

                    case 404:
                        return toast.error(
                            'Sorry, the resource you were looking for could not be found.'
                        );

                    default:
                        return toast.error(
                            errorMessage ||
                                'Sorry, something went wrong. Please try again later.'
                        );
                }
        }
    }

    return next(action);
};
