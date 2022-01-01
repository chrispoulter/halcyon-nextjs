import { isRejectedWithValue } from '@reduxjs/toolkit';
import { showToast, removeToken } from '../features';

export const rtkQueryErrorLogger =
    ({ dispatch }) =>
    next =>
    action => {
        if (isRejectedWithValue(action)) {
            switch (action.payload.status) {
                case 400:
                    dispatch(
                        showToast({
                            variant: 'danger',
                            message: action.payload.data.message
                        })
                    );
                    break;

                case 401:
                    dispatch(removeToken());
                    break;

                case 403:
                    dispatch(
                        showToast({
                            variant: 'warn',
                            message: action.payload.data.message
                        })
                    );
                    break;

                case 404:
                case 200:
                    break;

                default:
                    dispatch(
                        showToast({
                            variant: 'danger',
                            message:
                                action.payload.data.message ||
                                'An unknown error has occurred whilst communicating with the server.'
                        })
                    );
                    break;
            }
        }

        return next(action);
    };
