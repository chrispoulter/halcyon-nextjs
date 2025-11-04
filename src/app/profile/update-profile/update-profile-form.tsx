import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { CalendarIcon } from 'lucide-react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { LoadingButton } from '@/components/loading-button';
import { isInPast, toDateOnly, toDisplay } from '@/lib/dates';
import { cn } from '@/lib/utils';

const schema = z.object({
    emailAddress: z.email('Email Address must be a valid email'),
    firstName: z
        .string({ message: 'Last Name must be a valid string' })
        .min(1, 'First Name is a required field')
        .max(50, 'First Name must be no more than 50 characters'),
    lastName: z
        .string({ message: 'Last Name must be a valid string' })
        .min(1, 'Last Name is a required field')
        .max(50, 'Last Name must be no more than 50 characters'),
    dateOfBirth: z.iso
        .date('Date Of Birth must be a valid date')
        .refine(isInPast, { message: 'Date Of Birth must be in the past' }),
});

export type UpdateProfileFormValues = z.infer<typeof schema>;

type UpdateProfileFormProps = {
    values: UpdateProfileFormValues;
    loading?: boolean;
    onSubmit: (data: UpdateProfileFormValues) => void;
    children?: React.ReactNode;
};

export function UpdateProfileForm({
    values,
    loading,
    onSubmit,
    children,
}: UpdateProfileFormProps) {
    const [open, setOpen] = useState(false);

    const form = useForm<UpdateProfileFormValues>({
        resolver: zodResolver(schema),
        values,
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
                                        'w-full pl-3 text-left font-normal',
                                        !field.value && 'text-muted-foreground'
                                    )}
                                >
                                    {field.value ? (
                                        toDisplay(field.value)
                                    ) : (
                                        <span>Select...</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-auto p-0"
                                align="start"
                            >
                                <Calendar
                                    timeZone="UTC"
                                    mode="single"
                                    selected={field.value as unknown as Date}
                                    defaultMonth={
                                        field.value as unknown as Date
                                    }
                                    required
                                    onSelect={(date) => {
                                        field.onChange(toDateOnly(date));
                                        setOpen(false);
                                    }}
                                    disabled={(date) => !isInPast(date)}
                                    captionLayout="dropdown"
                                />
                            </PopoverContent>
                        </Popover>
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
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
