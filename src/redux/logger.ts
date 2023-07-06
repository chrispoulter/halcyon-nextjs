import { Middleware, isRejectedWithValue } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';

export const logger: Middleware = () => next => action => {
    if (isRejectedWithValue(action)) {
        switch (action.payload.status) {
            case 400:
                toast.error(
                    action.payload.data?.message ||
                        'Sorry, the current request is invalid.'
                );
                break;

            case 401:
                // dispatch(removeToken());
                // window.location.href = '/login';
                break;

            case 403:
                toast.error(
                    action.payload.data?.message ||
                        'Sorry, you do not have access to this resource.'
                );
                break;

            case 404:
            case 200:
                break;

            default:
                toast.error(
                    action.payload.data?.message ||
                        'An unknown error has occurred whilst communicating with the server.'
                );
                break;
        }
    }

    return next(action);
};
