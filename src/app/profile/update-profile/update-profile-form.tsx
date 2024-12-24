'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { GetProfileResponse } from '@/app/actions/getProfileAction';
import { updateProfileAction } from '@/app/actions/updateProfileAction';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { DateFormField } from '@/components/date-form-field';
import { TextFormField } from '@/components/text-form-field';
import { toast } from '@/hooks/use-toast';
import { isInPast } from '@/lib/dates';
import { cn } from '@/lib/utils';

const formSchema = z.object({
    emailAddress: z
        .string({ message: 'Email Address must be a valid string' })
        .min(1, 'Email Address is a required field')
        .max(254, 'Password must be no more than 254 characters')
        .email('Email Address must be a valid email'),
    firstName: z
        .string({
            message: 'Confirm Password is a required field',
        })
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
        .min(1, 'Date Of Birth is a required field')
        .date('Date Of Birth must be a valid date')
        .refine(isInPast, { message: 'Date Of Birth must be in the past' }),
});

type UpdateProfileFormValues = z.infer<typeof formSchema>;

type UpdateProfileFormProps = {
    profile: GetProfileResponse;
    className?: string;
};

export function UpdateProfileForm({
    profile,
    className,
}: UpdateProfileFormProps) {
    const router = useRouter();

    const form = useForm<UpdateProfileFormValues>({
        resolver: zodResolver(formSchema),
        values: profile,
    });

    async function onSubmit(data: UpdateProfileFormValues) {
        const result = await updateProfileAction(data);

        toast({
            title: 'Your profile has been updated.',
            description: JSON.stringify(result),
        });

        router.push('/profile');
    }

    return (
        <Form {...form}>
            <form
                noValidate
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn('space-y-6', className)}
            >
                <TextFormField
                    field="emailAddress"
                    label="Email Address"
                    type="email"
                    maxLength={254}
                    autoComplete="username"
                    required
                />

                <div className="flex flex-col gap-6 sm:flex-row">
                    <TextFormField
                        field="firstName"
                        label="First Name"
                        maxLength={50}
                        autoComplete="given-name"
                        required
                        className="flex-1"
                    />
                    <TextFormField
                        field="lastName"
                        label="Last Name"
                        maxLength={50}
                        autoComplete="family-name"
                        required
                        className="flex-1"
                    />
                </div>

                <DateFormField
                    field="dateOfBirth"
                    label="Date Of Birth"
                    autoComplete={['bday-day', 'bday-month', 'bday-year']}
                    required
                />

                <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row">
                    <Button asChild variant="outline">
                        <Link href="/profile">Cancel</Link>
                    </Button>

                    <Button type="submit">Submit</Button>
                </div>
            </form>
        </Form>
    );
}
