import nodeFetch from 'node-fetch';
import { URLSearchParams } from 'url';

export const fetch = async config => {
    const response = await nodeFetch(config.url, {
        ...config,
        body: new URLSearchParams(config.body)
    });

    return response.json();
};
