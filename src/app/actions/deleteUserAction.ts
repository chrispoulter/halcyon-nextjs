'use server';

import { trace } from '@opentelemetry/api';
import { z } from 'zod';
import { Role } from '@/lib/definitions';
import { verifySession } from '@/lib/session';

const actionSchema = z.object({
    id: z
        .string({ message: 'Id must be a valid string' })
        .min(1, 'Id is a required field')
        .uuid('Id must be a valid UUID'),
    version: z.string({ message: 'Version must be a valid string' }).optional(),
});

export async function deleteUserAction(data: unknown) {
    return await trace
        .getTracer('halcyon-web')
        .startActiveSpan('deleteUserAction', async (span) => {
            try {
                const session = await verifySession([
                    Role.SYSTEM_ADMINISTRATOR,
                    Role.USER_ADMINISTRATOR,
                ]);

                const request = actionSchema.safeParse(data);

                if (!request.success) {
                    return {
                        errors: request.error.flatten().fieldErrors,
                    };
                }

                const { id, ...rest } = request.data;

                const response = await fetch(
                    `${process.env.services__api__https__0}/user/${id}`,
                    {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${session.accessToken}`,
                        },
                        body: JSON.stringify(rest),
                    }
                );

                if (!response.ok) {
                    return {
                        errors: [
                            'An error occurred while processing your request',
                        ],
                    };
                }

                return await response.json();
            } finally {
                span.end();
            }
        });
}
