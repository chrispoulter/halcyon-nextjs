import { HandlerResponse } from '@/utils/handler';
import { config } from '@/utils/config';

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
    const result = await fetch(`${config.SITE_URL}${url}`, {
        ...init,
        headers: {
            'Content-Type': 'application/json',
            ...init?.headers
        }
    });

    let response: HandlerResponse | undefined = undefined;

    try {
        response = await result.json();
    } catch (_) {}

    if (!result.ok) {
        throw new FetchError(result.status, response);
    }

    return response as HandlerResponse<TResponse>;
};
