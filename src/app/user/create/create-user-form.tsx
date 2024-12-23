'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createUserAction } from '@/app/actions/createUserAction';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { Role } from '@/lib/definitions';
import { isInPast } from '@/lib/dates';
import { cn } from '@/lib/utils';

const formSchema = z
    .object({
        emailAddress: z
            .string({ message: 'Email Address must be a valid string' })
            .min(1, 'Email Address is a required field')
            .max(254, 'Password must be no more than 254 characters')
            .email('Email Address must be a valid email'),
        password: z
            .string({ message: 'Password must be a valid string' })
            .min(8, 'Password must be at least 8 characters')
            .max(50, 'Password must be no more than 50 characters'),
        confirmPassword: z
            .string({
                message: 'Confirm Password is a required field',
            })
            .min(1, 'Confirm Password is a required field'),
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
        roles: z
            .array(
                z.nativeEnum(Role, {
                    message: 'Role must be a valid system role',
                }),
                { message: 'Role must be a valid array' }
            )
            .optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

type CreateUserFormProps = {
    className?: string;
};

export function CreateUserForm({ className }: CreateUserFormProps) {
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            emailAddress: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            roles: [],
        },
    });

    async function onSubmit(data: z.infer<typeof formSchema>) {
        const result = await createUserAction(data);

        toast({
            title: 'User successfully created.',
            description: JSON.stringify(result),
        });

        router.push('/user');
    }

    return (
        <Form {...form}>
            <form
                noValidate
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn('space-y-6', className)}
            >
                <FormField
                    control={form.control}
                    name="emailAddress"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="email"
                                    maxLength={254}
                                    autoComplete="username"
                                    required
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex flex-col gap-6 sm:flex-row">
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="password"
                                        maxLength={50}
                                        autoComplete="new-password"
                                        required
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="password"
                                        maxLength={50}
                                        autoComplete="new-password"
                                        required
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex flex-col gap-6 sm:flex-row">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        maxLength={50}
                                        autoComplete="given-name"
                                        required
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        maxLength={50}
                                        autoComplete="family-name"
                                        required
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Date Of Birth</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="date"
                                    autoComplete="bday"
                                    required
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="roles"
                    render={({ field }) => {
                        const currentValue = field.value || [];

                        return (
                            <>
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            System Administrator
                                        </FormLabel>
                                        <FormDescription>
                                            A system administrator has access to
                                            the entire system.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value?.includes(
                                                Role.SYSTEM_ADMINISTRATOR
                                            )}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    return field.onChange([
                                                        ...currentValue,
                                                        Role.SYSTEM_ADMINISTRATOR,
                                                    ]);
                                                }

                                                return field.onChange(
                                                    currentValue.filter(
                                                        (role) =>
                                                            role !==
                                                            Role.SYSTEM_ADMINISTRATOR
                                                    )
                                                );
                                            }}
                                        />
                                    </FormControl>
                                </FormItem>
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            User Administrator
                                        </FormLabel>
                                        <FormDescription>
                                            A user administrator can create /
                                            update / delete users.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value?.includes(
                                                Role.USER_ADMINISTRATOR
                                            )}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    return field.onChange([
                                                        ...currentValue,
                                                        Role.USER_ADMINISTRATOR,
                                                    ]);
                                                }

                                                return field.onChange(
                                                    currentValue.filter(
                                                        (role) =>
                                                            role !==
                                                            Role.USER_ADMINISTRATOR
                                                    )
                                                );
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            </>
                        );
                    }}
                />
                <Button asChild variant="secondary" className="w-full">
                    <Link href="/user">Cancel</Link>
                </Button>
                <Button type="submit" className="w-full">
                    Submit
                </Button>
            </form>
        </Form>
    );
}
