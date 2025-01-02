'use server';

import { z } from 'zod';
import { apiClient } from '@/lib/api-client';
import { ServerActionResult } from '@/lib/action-types';

const schema = z.object({
    emailAddress: z
        .string({ message: 'Email Address must be a valid string' })
        .email('Email Address must be a valid email'),
});

type ForgotPasswordActionValues = z.infer<typeof schema>;

export async function forgotPasswordAction(
    input: ForgotPasswordActionValues
): Promise<ServerActionResult> {
    const parsedInput = await schema.safeParseAsync(input);

    if (!parsedInput.success) {
        return {
            validationErrors: parsedInput.error.flatten(),
        };
    }

    return await apiClient.put('/account/forgot-password', parsedInput.data);
}
