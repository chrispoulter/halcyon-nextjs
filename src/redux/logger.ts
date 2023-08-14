import { Middleware, isFulfilled, isRejectedWithValue } from '@reduxjs/toolkit';
import router from 'next/router';
import { signOut } from 'next-auth/react';
import toast from 'react-hot-toast';

export const logger: Middleware = () => next => async action => {
    if (typeof window === 'undefined') {
        return next(action);
    }

    if (isRejectedWithValue(action)) {
        const { request, response } = action.meta.baseQueryMeta;
        const method = request.method;
        const status = response?.status;
        const message = action.payload.data?.message;

        switch (method) {
            case 'GET':
                switch (status) {
                    case 401:
                        await signOut({ callbackUrl: '/' });
                        break;

                    case 403:
                        await router.push('/403', router.asPath);
                        break;

                    case 404:
                        await router.push('/404', router.asPath);
                        break;

                    default:
                        await router.push('/500', router.asPath);
                        break;
                }

                break;

            default:
                switch (status) {
                    case 401:
                        await signOut({ callbackUrl: '/' });
                        break;

                    case 403:
                        toast.error(
                            'Sorry, you do not have access to this resource.'
                        );
                        break;

                    case 404:
                        toast.error(
                            'Sorry, the resource you were looking for could not be found.'
                        );
                        break;

                    default:
                        toast.error(
                            message ||
                                'Sorry, something went wrong. Please try again later.'
                        );
                        break;
                }
                break;
        }
    }

    if (isFulfilled(action)) {
        const message = action.payload?.message;

        if (message) {
            toast.success(message);
        }
    }

    return next(action);
};
