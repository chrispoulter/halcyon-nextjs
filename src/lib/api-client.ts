import { config } from '@/lib/config';
import { forbidden, unauthorized } from 'next/navigation';

export class ApiClientError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ApiClientError';
    }
}

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private async fetch<T>(
        path: string,
        method: string,
        params?: Record<string, string | number | boolean>,
        body?: Record<string, unknown>,
        headers: Record<string, string> = {}
    ): Promise<T> {
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
                    unauthorized();

                case 403:
                    forbidden();

                case 404:
                    if (method === 'GET') {
                        return undefined as T;
                    }

                    break;
                default:
                    if (contentType.includes('application/problem+json')) {
                        const problem = await response.json();
                        throw new ApiClientError(problem.title);
                    }

                    throw new ApiClientError(
                        `HTTP ${response.status} ${response.statusText}`
                    );
            }
        }

        if (contentType.includes('application/json')) {
            return (await response.json()) as T;
        }

        return (await response.text()) as T;
    }

    get<T>(
        path: string,
        params: Record<string, string | number | boolean> = {},
        headers: Record<string, string> = {}
    ): Promise<T> {
        return this.fetch<T>(path, 'GET', params, undefined, headers);
    }

    post<T>(
        path: string,
        body: Record<string, unknown>,
        headers: Record<string, string> = {}
    ): Promise<T> {
        return this.fetch<T>(path, 'POST', undefined, body, headers);
    }

    put<T>(
        path: string,
        body: Record<string, unknown>,
        headers: Record<string, string> = {}
    ): Promise<T> {
        return this.fetch<T>(path, 'PUT', undefined, body, headers);
    }

    delete<T>(
        path: string,
        body: Record<string, unknown>,
        headers: Record<string, string> = {}
    ): Promise<T> {
        return this.fetch<T>(path, 'DELETE', undefined, body, headers);
    }
}

export const apiClient = new ApiClient(config.API_URL);
