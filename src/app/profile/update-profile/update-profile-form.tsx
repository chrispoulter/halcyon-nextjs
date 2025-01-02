'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import type { GetProfileResponse } from '@/app/profile/profile-types';
import { updateProfileAction } from '@/app/profile/actions/update-profile-action';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { DateFormField } from '@/components/date-form-field';
import { TextFormField } from '@/components/text-form-field';
import { ServerActionErrorMessage } from '@/components/server-action-error';
import { toast } from '@/hooks/use-toast';
import { isServerActionSuccess } from '@/lib/action-types';
import { isInPast } from '@/lib/dates';

const schema = z.object({
    emailAddress: z
        .string({ message: 'Email Address must be a valid string' })
        .email('Email Address must be a valid email'),
    firstName: z
        .string({ message: 'Last Name must be a valid string' })
        .min(1, 'First Name is a required field')
        .max(50, 'First Name must be no more than 50 characters'),
    lastName: z
        .string({ message: 'Last Name must be a valid string' })
        .min(1, 'Last Name is a required field')
        .max(50, 'Last Name must be no more than 50 characters'),
    dateOfBirth: z
        .string({
            message: 'Date of Birth must be a valid string',
        })
        .date('Date Of Birth must be a valid date')
        .refine(isInPast, { message: 'Date Of Birth must be in the past' }),
});

type UpdateProfileFormValues = z.infer<typeof schema>;

type UpdateProfileFormProps = {
    profile: GetProfileResponse;
};

export function UpdateProfileForm({ profile }: UpdateProfileFormProps) {
    const router = useRouter();

    const form = useForm<UpdateProfileFormValues>({
        resolver: zodResolver(schema),
        values: profile,
    });

    async function onSubmit(data: UpdateProfileFormValues) {
        const result = await updateProfileAction(data);

        if (!isServerActionSuccess(result)) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: <ServerActionErrorMessage result={result} />,
            });

            return;
        }

        toast({
            title: 'Success',
            description: 'Your profile has been updated.',
        });

        router.push('/profile');
    }

    const { isSubmitting } = form.formState;

    return (
        <Form {...form}>
            <form
                noValidate
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
            >
                <TextFormField<UpdateProfileFormValues>
                    field="emailAddress"
                    label="Email Address"
                    type="email"
                    maxLength={254}
                    autoComplete="username"
                    required
                    disabled={isSubmitting}
                />

                <div className="flex flex-col gap-6 sm:flex-row">
                    <TextFormField<UpdateProfileFormValues>
                        field="firstName"
                        label="First Name"
                        maxLength={50}
                        autoComplete="given-name"
                        required
                        disabled={isSubmitting}
                        className="flex-1"
                    />
                    <TextFormField<UpdateProfileFormValues>
                        field="lastName"
                        label="Last Name"
                        maxLength={50}
                        autoComplete="family-name"
                        required
                        disabled={isSubmitting}
                        className="flex-1"
                    />
                </div>

                <DateFormField<UpdateProfileFormValues>
                    field="dateOfBirth"
                    label="Date Of Birth"
                    autoComplete={['bday-day', 'bday-month', 'bday-year']}
                    required
                    disabled={isSubmitting}
                />

                <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row">
                    <Button asChild variant="outline">
                        <Link href="/profile" className="min-w-32">
                            Cancel
                        </Link>
                    </Button>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="min-w-32"
                    >
                        {isSubmitting ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            'Submit'
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
