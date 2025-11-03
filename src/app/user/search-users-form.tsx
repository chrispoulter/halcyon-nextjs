import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Field, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

const schema = z.object({
    search: z
        .string({
            message: 'Search must be a valid string',
        })
        .optional(),
});

export type SearchUsersFormValues = z.infer<typeof schema>;

type SearchUsersFormProps = {
    search?: string;
    onSubmit: (data: SearchUsersFormValues) => void;
    disabled?: boolean;
};

export function SearchUsersForm({
    search = '',
    onSubmit,
    disabled,
}: SearchUsersFormProps) {
    const form = useForm<SearchUsersFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            search,
        },
    });

    return (
        <form
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full gap-2"
        >
            <Controller
                control={form.control}
                name="search"
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <Input
                            {...field}
                            type="search"
                            placeholder="Search Users..."
                            disabled={disabled}
                        />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />

            <Button
                type="submit"
                variant="secondary"
                size="icon"
                disabled={disabled}
            >
                <Search />
                <span className="sr-only">Search users</span>
            </Button>
        </form>
    );
}
