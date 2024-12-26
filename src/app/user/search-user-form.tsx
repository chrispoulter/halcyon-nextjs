import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
    ArrowDownAZ,
    ArrowDownWideNarrow,
    ArrowUpAZ,
    Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Form } from '@/components/ui/form';

const formSchema = z.object({
    search: z.string().optional(),
});

type SearchUserFormValues = z.infer<typeof formSchema>;

const sortOptions = [
    {
        value: 'NAME_ASC',
        label: 'Name A-Z',
        icon: ArrowDownAZ,
    },
    {
        value: 'NAME_DESC',
        label: 'Name Z-A',
        icon: ArrowUpAZ,
    },
    {
        value: 'EMAIL_ADDRESS_ASC',
        label: 'Email Address A-Z',
        icon: ArrowDownAZ,
    },
    {
        value: 'EMAIL_ADDRESS_DESC',
        label: 'Email Address Z-A',
        icon: ArrowUpAZ,
    },
];

type SearchUserFormProps = {
    page?: any;
    size?: any;
    sort?: any;
    search?: any;
};

export function SearchUserForm({
    page,
    size,
    sort,
    search,
}: SearchUserFormProps) {
    const form = useForm<SearchUserFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            search: '',
        },
    });

    function onSubmit(data: SearchUserFormValues) {
        console.log(data);
    }

    return (
        <Form {...form}>
            <form
                noValidate
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex w-full items-center space-x-2"
            >
                <Input type="search" placeholder="Search..." />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size="icon">
                            <ArrowDownWideNarrow />
                            <span className="sr-only">Toggle sort</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        {sortOptions.map(({ label, value, icon: Icon }) => (
                            <DropdownMenuItem
                                key={value}
                                asChild
                                disabled={sort === value}
                            >
                                <Link
                                    href={{
                                        pathname: '/user',
                                        query: {
                                            page,
                                            size,
                                            sort: value,
                                            search,
                                        },
                                    }}
                                >
                                    <Icon />
                                    <span>{label}</span>
                                </Link>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                <Button type="submit" size="icon">
                    <Search />
                    <span className="sr-only">Search users</span>
                </Button>
            </form>
        </Form>
    );
}
