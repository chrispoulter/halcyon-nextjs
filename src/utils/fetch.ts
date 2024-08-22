import { getSession } from 'next-auth/react';

class FetchError extends Error {
    status: number;
    response?: any;

    constructor(status: number, response?: any) {
        super('An error has occurred whilst communicating with the server.');
        this.name = 'FetchError';
        this.status = status;
        this.response = response;
    }
}

export const fetcher = async <TResponse>(url: string) => {
    const session = await getSession();

    const result = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.accessToken}`
        }
    });

    const isJson = result.headers
        .get('content-type')
        ?.includes('application/json');

    const response: TResponse = isJson ? await result.json() : undefined;

    if (!result.ok) {
        throw new FetchError(result.status, response);
    }

    return response;
};
