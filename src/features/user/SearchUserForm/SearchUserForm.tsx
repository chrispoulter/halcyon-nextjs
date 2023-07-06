import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/Input/Input';
import { Button } from '@/components/Button/Button';
import { SearchIcon } from '@/components/Icons/SearchIcon';

const schema = Yup.object({
    search: Yup.string().label('Search')
});

export type SearchUserFormValues = Yup.InferType<typeof schema>;

type SearchUserFormProps = {
    isLoading?: boolean;
    values: SearchUserFormValues;
    onSubmit: (values: SearchUserFormValues) => void;
};

export const SearchUserForm = ({
    onSubmit,
    values,
    isLoading
}: SearchUserFormProps) => (
    <Formik
        initialValues={values as any}
        validationSchema={schema}
        onSubmit={onSubmit}
    >
        {({ isSubmitting, handleSubmit }) => (
            <Form noValidate className="flex w-full gap-1">
                <Input
                    label="Search Term"
                    name="search"
                    type="search"
                    placeholder="Search Users..."
                    disabled={isSubmitting || isLoading}
                    hideLabel={true}
                    onClear={handleSubmit}
                />
                <div>
                    <Button
                        type="submit"
                        variant="secondary"
                        aria-label="Search"
                        disabled={isLoading}
                        loading={isSubmitting}
                    >
                        <SearchIcon className="h-4 w-4" />
                    </Button>
                </div>
            </Form>
        )}
    </Formik>
);
