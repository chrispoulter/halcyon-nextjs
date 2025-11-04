import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { ChevronDownIcon } from 'lucide-react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { LoadingButton } from '@/components/loading-button';
import { isInPast, toDateOnly, toDisplay } from '@/lib/dates';
import { Role, roleOptions, roles } from '@/lib/definitions';
import { cn } from '@/lib/utils';

const schema = z
    .object({
        emailAddress: z.email('Email Address must be a valid email'),
        password: z
            .string({ message: 'Password must be a valid string' })
            .min(8, 'Password must be at least 8 characters')
            .max(50, 'Password must be no more than 50 characters'),
        confirmPassword: z
            .string({
                message: 'Confirm Password must be a valid string',
            })
            .min(1, 'Confirm Password is a required field'),
        firstName: z
            .string({ message: 'First Name must be a valid string' })
            .min(1, 'First Name is a required field')
            .max(50, 'First Name must be no more than 50 characters'),
        lastName: z
            .string({ message: 'Last Name must be a valid string' })
            .min(1, 'Last Name is a required field')
            .max(50, 'Last Name must be no more than 50 characters'),
        dateOfBirth: z.iso
            .date('Date Of Birth must be a valid date')
            .refine(isInPast, { message: 'Date Of Birth must be in the past' }),
        roles: z
            .array(
                z.enum(roles, {
                    message: 'Role must be a valid user role',
                }),
                { message: 'Role must be a valid array' }
            )
            .optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

export type CreateUserFormValues = z.infer<typeof schema>;

type CreateUserFormProps = {
    loading?: boolean;
    onSubmit: (data: CreateUserFormValues) => void;
    children?: React.ReactNode;
};

export function CreateUserForm({
    loading,
    onSubmit,
    children,
}: CreateUserFormProps) {
    const [open, setOpen] = useState(false);

    const form = useForm<CreateUserFormValues>({
        resolver: zodResolver(schema),
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

    return (
        <form
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
        >
            <Controller
                name="emailAddress"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                            Email Address
                        </FieldLabel>
                        <Input
                            {...field}
                            type="email"
                            maxLength={254}
                            autoComplete="username"
                            required
                            disabled={loading}
                            aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />

            <div className="flex flex-col gap-6 sm:flex-row">
                <Controller
                    name="password"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>
                                Password
                            </FieldLabel>
                            <Input
                                {...field}
                                type="password"
                                maxLength={50}
                                autoComplete="new-password"
                                required
                                disabled={loading}
                                aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="confirmPassword"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>
                                Confirm Password
                            </FieldLabel>
                            <Input
                                {...field}
                                type="password"
                                maxLength={50}
                                autoComplete="new-password"
                                required
                                disabled={loading}
                                aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
            </div>

            <div className="flex flex-col gap-6 sm:flex-row">
                <Controller
                    name="firstName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>
                                First Name
                            </FieldLabel>
                            <Input
                                {...field}
                                maxLength={50}
                                autoComplete="given-name"
                                required
                                disabled={loading}
                                aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="lastName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>
                                Last Name
                            </FieldLabel>
                            <Input
                                {...field}
                                maxLength={50}
                                autoComplete="family-name"
                                required
                                disabled={loading}
                                aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
            </div>

            <Controller
                name="dateOfBirth"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                            Date Of Birth
                        </FieldLabel>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    disabled={field.disabled}
                                    aria-invalid={fieldState.invalid}
                                    className={cn(
                                        'w-48 justify-between font-normal',
                                        !field.value && 'text-muted-foreground'
                                    )}
                                >
                                    {field.value ? (
                                        toDisplay(field.value)
                                    ) : (
                                        <span>Select...</span>
                                    )}
                                    <ChevronDownIcon />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-auto overflow-hidden p-0"
                                align="start"
                            >
                                <Calendar
                                    timeZone="UTC"
                                    mode="single"
                                    captionLayout="dropdown"
                                    selected={field.value as unknown as Date}
                                    defaultMonth={
                                        field.value as unknown as Date
                                    }
                                    onSelect={(date) => {
                                        field.onChange(toDateOnly(date));
                                        setOpen(false);
                                    }}
                                    disabled={(date) => !isInPast(date)}
                                />
                            </PopoverContent>
                        </Popover>
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />

            <Controller
                name="roles"
                control={form.control}
                render={({ field, fieldState }) => (
                    <>
                        {Object.entries(roleOptions).map(
                            ([key, { title, description }]) => (
                                <Field
                                    key={key}
                                    orientation="horizontal"
                                    data-invalid={fieldState.invalid}
                                    className="rounded-lg border p-4"
                                >
                                    <FieldContent>
                                        <FieldLabel
                                            htmlFor={`${field.name}-${key}`}
                                        >
                                            {title}
                                        </FieldLabel>
                                        <FieldDescription>
                                            {description}
                                        </FieldDescription>
                                    </FieldContent>
                                    <Switch
                                        id={`${field.name}-${key}`}
                                        name={field.name}
                                        checked={field.value?.includes(
                                            key as Role
                                        )}
                                        value={key}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                return field.onChange([
                                                    ...(field.value || []),
                                                    key,
                                                ]);
                                            }

                                            return field.onChange(
                                                field.value?.filter(
                                                    (item) => item !== key
                                                )
                                            );
                                        }}
                                        disabled={loading}
                                        aria-invalid={fieldState.invalid}
                                    />
                                </Field>
                            )
                        )}
                    </>
                )}
            />

            <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row">
                {children}

                <LoadingButton type="submit" loading={loading}>
                    Submit
                </LoadingButton>
            </div>
        </form>
    );
}
