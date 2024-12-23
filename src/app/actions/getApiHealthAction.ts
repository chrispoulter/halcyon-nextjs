'use server';

import { trace } from '@opentelemetry/api';

export async function getApiHealthAction() {
    return await trace
        .getTracer('halcyon')
        .startActiveSpan('getApiHealth', async (span) => {
            try {
                const response = await fetch(`${process.env.API_URL}/health`);

                if (!response.ok) {
                    return {
                        errors: [
                            'An error occurred while processing your request',
                        ],
                    };
                }

                return await response.text();
            } finally {
                span.end();
            }
        });
}
