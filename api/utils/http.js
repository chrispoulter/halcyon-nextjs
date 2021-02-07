import nodeFetch from 'node-fetch';
import { URLSearchParams } from 'url';

export const fetch = async config => {
    try {
        const response = await nodeFetch(config.url, {
            ...config,
            body: new URLSearchParams(config.body)
        });

        return await response.json();
    } catch (error) {
        console.error(error);
        return undefined;
    }
};
