import { config } from './config';

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private async request<T>(
        endpoint: string,
        method: string,
        body?: Record<string, unknown>,
        headers: Record<string, string> = {},
        params?: Record<string, string | number | boolean>
    ): Promise<T | null> {
        const querystring = params
            ? Object.entries(params)
                  .filter((_, value) => !!value)
                  .map((pair) => pair.map(encodeURIComponent).join('='))
                  .join('&')
            : '';

        const url = `${this.baseUrl}${endpoint}?${querystring}`;

        const options: RequestInit = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            body: body ? JSON.stringify(body) : undefined,
        };

        const response = await fetch(url, options);

        if (response.status === 404) {
            return null;
        }

        if (!response.ok) {
            const contentType = response.headers.get('Content-Type') || '';

            if (contentType.includes('application/problem+json')) {
                const problem = await response.json();
                throw new ApiClientError(
                    problem.title ||
                        `HTTP ${response.status}: ${response.statusText}`
                );
            }

            throw new ApiClientError(
                `HTTP ${response.status}: ${response.statusText}`
            );
        }

        return response.json();
    }

    public get<T>(
        endpoint: string,
        params?: Record<string, string | number | boolean>,
        headers?: Record<string, string>
    ): Promise<T | null> {
        return this.request<T>(endpoint, 'GET', undefined, headers, params);
    }

    public post<T>(
        endpoint: string,
        body: Record<string, unknown>,
        headers?: Record<string, string>
    ): Promise<T | null> {
        return this.request<T>(endpoint, 'POST', body, headers, undefined);
    }

    public put<T>(
        endpoint: string,
        body: Record<string, unknown>,
        headers?: Record<string, string>
    ): Promise<T | null> {
        return this.request<T>(endpoint, 'PUT', body, headers, undefined);
    }

    public delete<T>(
        endpoint: string,
        body?: Record<string, unknown>,
        headers?: Record<string, string>
    ): Promise<T | null> {
        return this.request<T>(endpoint, 'DELETE', body, headers, undefined);
    }
}

export class ApiClientError extends Error {}

export const apiClient = new ApiClient(config.API_URL);
