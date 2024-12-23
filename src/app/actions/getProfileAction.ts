'use server';

import { trace } from '@opentelemetry/api';
import { verifySession } from '@/lib/session';

export type GetProfileResponse = {
    id: string;
    emailAddress: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    version: string;
};

export async function getProfileAction() {
    return await trace
        .getTracer('halcyon')
        .startActiveSpan('getProfileAction', async (span) => {
            try {
                const session = await verifySession();

                const response = await fetch(`${process.env.API_URL}/profile`, {
                    headers: {
                        Authorization: `Bearer ${session.accessToken}`,
                    },
                });

                if (!response.ok) {
                    return {
                        errors: [
                            'An error occurred while processing your request',
                        ],
                    };
                }

                return (await response.json()) as GetProfileResponse;
            } finally {
                span.end();
            }
        });
}
