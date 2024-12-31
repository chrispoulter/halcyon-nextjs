import { forbidden, redirect } from 'next/navigation';
import { deleteSession } from '@/lib/session';
import { config } from '@/lib/config';

export class ApiClientError extends Error {}

export async function fetcher<T>(
    url: string,
    options: RequestInit & {
        accessToken?: string;
        params?: unknown;
        json?: unknown;
    }
): Promise<T | null> {
    const response = await fetch(`${config.API_URL}${url}`, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: options.accessToken
                ? `Bearer ${options.accessToken}`
                : '',
        },
        body: JSON.stringify(options.json),
    });

    if (!response.ok) {
        switch (response.status) {
            case 401:
                await deleteSession();
                return redirect('/account/login');

            case 403:
                return forbidden();

            case 404:
                return null;

            default:
                const error = response.headers
                    .get('content-type')
                    ?.includes('application/problem+json')
                    ? await response.json()
                    : await response.text();

                throw new ApiClientError(
                    error?.title ||
                        error ||
                        `${response.status} ${response.statusText}`
                );
        }
    }

    return (await response.json()) as T;
}
