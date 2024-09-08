import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { SearchIcon } from '@/components/search-icon';

const schema = z.object({
    search: z.string().optional()
});

export type SearchUserFormValues = z.infer<typeof schema>;

type SearchUserFormProps = {
    isLoading?: boolean;
    values: SearchUserFormValues;
    onSubmit: (values: SearchUserFormValues) => void;
};

export const SearchUserForm = ({
    onSubmit,
    values,
    isLoading
}: SearchUserFormProps) => {
    const { handleSubmit, control } = useForm<SearchUserFormValues>({
        resolver: zodResolver(schema),
        values
    });

    return (
        <form
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            className="flex w-full gap-1"
        >
            <Input
                control={control}
                label="Search Term"
                name="search"
                type="search"
                placeholder="Search Users..."
                disabled={isLoading}
                hideLabel={true}
                onClear={handleSubmit(onSubmit)}
            />
            <div>
                <Button
                    type="submit"
                    variant="secondary"
                    aria-label="Search"
                    disabled={isLoading}
                >
                    <SearchIcon className="h-4 w-4" />
                </Button>
            </div>
        </form>
    );
};
