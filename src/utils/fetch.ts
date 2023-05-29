import { HandlerResponse } from '@/utils/handler';

class FetchError extends Error {
    status: number;
    response?: HandlerResponse;

    constructor(status: number, response?: HandlerResponse) {
        super('An error has occurred whilst communicating with the server.');
        this.name = 'FetchError';
        this.status = status;
        this.response = response;
    }
}

export const fetcher = async <TResponse = HandlerResponse>(
    url: string,
    init?: RequestInit
) => {
    const result = await fetch(url, {
        ...init,
        headers: {
            'Content-Type': 'application/json',
            ...init?.headers
        }
    });

    const isJson = result.headers
        .get('content-type')
        ?.includes('application/json');

    const response: HandlerResponse<TResponse> = isJson
        ? await result.json()
        : undefined;

    if (!result.ok) {
        throw new FetchError(result.status, response);
    }

    return response;
};
