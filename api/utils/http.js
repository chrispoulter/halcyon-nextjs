import nodeFetch from 'node-fetch';
import { URLSearchParams } from 'url';
import { captureException } from './logger';

export const fetch = async config => {
    try {
        const response = await nodeFetch(config.url, {
            ...config,
            body: new URLSearchParams(config.body)
        });

        return await response.json();
    } catch (error) {
        captureException(error);
        return undefined;
    }
};
