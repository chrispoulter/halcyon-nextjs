'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const schema = z.object({
    search: z
        .string({
            message: 'Search must be a valid string',
        })
        .optional(),
});

type SearchUserFormValues = z.infer<typeof schema>;

type SearchUserFormProps = {
    search: string;
};

export function SearchUserForm({ search }: SearchUserFormProps) {
    const router = useRouter();

    const pathname = usePathname();

    const searchParams = useSearchParams();

    const form = useForm<SearchUserFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            search,
        },
    });

    function onSubmit(data: SearchUserFormValues) {
        const params = new URLSearchParams(searchParams.toString());

        params.delete('page');
        params.delete('search');

        if (data.search) {
            params.set('search', data.search);
        }

        return router.push(`${pathname}?${params.toString()}`);
    }

    return (
        <Form {...form}>
            <form
                noValidate
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex w-full gap-2"
            >
                <FormField
                    control={form.control}
                    name="search"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormControl>
                                <Input
                                    {...field}
                                    type="search"
                                    placeholder="Search Users..."
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" variant="secondary" size="icon">
                    <Search />
                    <span className="sr-only">Search users</span>
                </Button>
            </form>
        </Form>
    );
}
