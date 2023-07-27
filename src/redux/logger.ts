import { Middleware, isFulfilled, isRejectedWithValue } from '@reduxjs/toolkit';
import router from 'next/router';
import { signOut } from 'next-auth/react';
import toast from 'react-hot-toast';

export const logger: Middleware = () => next => action => {
    if (isRejectedWithValue(action)) {
        const method = action.meta.baseQueryMeta.request.method;
        const status = action.meta.baseQueryMeta.response.status;
        const message = action.payload.data.message;

        switch (method) {
            case 'GET':
                switch (status) {
                    case 401:
                        signOut({ callbackUrl: router.asPath });
                        break;

                    case 403:
                        router.push('/403', router.asPath);
                        break;

                    case 404:
                        router.push('/404', router.asPath);
                        break;

                    default:
                        router.push('/500', router.asPath);
                        break;
                }

                break;

            default:
                switch (status) {
                    case 401:
                        signOut({ callbackUrl: router.asPath });
                        break;

                    default:
                        toast.error(message);
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
