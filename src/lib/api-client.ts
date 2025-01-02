import { forbidden, notFound, unauthorized } from 'next/navigation';
import { config } from '@/lib/config';

type ApliClientResult<Data> = { data?: Data; error?: string };

export function isApiClientResultSuccess<Data>(
    result?: ApliClientResult<Data>
): result is {
    data: Data;
} {
    if (!result) {
        return false;
    }

    if (result.error) {
        return false;
    }

    return true;
}

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private async fetch<Data>(
        path: string,
        method: string,
        params?: Record<string, string | number | boolean>,
        body?: Record<string, unknown>,
        headers: Record<string, string> = {},
        doNotThrowError = false
    ): Promise<ApliClientResult<Data>> {
        const url = new URL(path, this.baseUrl);

        if (params) {
            for (const [key, value] of Object.entries(params)) {
                url.searchParams.append(key, String(value));
            }
        }

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            body: body ? JSON.stringify(body) : undefined,
        });

        const contentType = response.headers.get('content-type') || '';

        if (!response.ok) {
            switch (response.status) {
                case 401:
                    if (doNotThrowError) {
                        return unauthorized();
                    }

                case 403:
                    if (doNotThrowError) {
                        return forbidden();
                    }

                case 404:
                    if (doNotThrowError) {
                        return notFound();
                    }

                default:
                    if (contentType.includes('application/problem+json')) {
                        const problem = await response.json();
                        return { error: problem.title };
                    }

                    return {
                        error: `HTTP ${response.status} ${response.statusText}`,
                    };
            }
        }

        if (contentType.includes('application/json')) {
            return { data: await response.json() };
        }

        return { data: (await response.text()) as Data };
    }

    get<Data>(
        path: string,
        params: Record<string, string | number | boolean> = {},
        headers: Record<string, string> = {}
    ): Promise<ApliClientResult<Data>> {
        return this.fetch<Data>(path, 'GET', params, undefined, headers, true);
    }

    post<Data>(
        path: string,
        body: Record<string, unknown>,
        headers: Record<string, string> = {}
    ): Promise<ApliClientResult<Data>> {
        return this.fetch<Data>(path, 'POST', undefined, body, headers);
    }

    put<Data>(
        path: string,
        body: Record<string, unknown>,
        headers: Record<string, string> = {}
    ): Promise<ApliClientResult<Data>> {
        return this.fetch<Data>(path, 'PUT', undefined, body, headers);
    }

    delete<Data>(
        path: string,
        body: Record<string, unknown>,
        headers: Record<string, string> = {}
    ): Promise<ApliClientResult<Data>> {
        return this.fetch<Data>(path, 'DELETE', undefined, body, headers);
    }
}

export const apiClient = new ApiClient(config.API_URL);
