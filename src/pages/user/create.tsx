import { useRouter } from 'next/router';
import { Container } from '@/components/Container/Container';
import { PageTitle, PageSubTitle } from '@/components/PageTitle/PageTitle';
import { ButtonLink } from '@/components/ButtonLink/ButtonLink';
import {
    CreateUserForm,
    CreateUserFormValues
} from '@/features/user/CreateUserForm/CreateUserForm';
import { useCreateUser } from '@/hooks/useCreateUser';
import { isUserAdministrator } from '@/utils/auth';

const CreateUser = () => {
    const router = useRouter();

    const { createUser } = useCreateUser();

    const onSubmit = async (values: CreateUserFormValues) => {
        try {
            await createUser(values);
            await router.push('/user');
        } catch (error) {
            console.warn(
                'An unhandled error was caught from onSubmit()',
                error
            );
        }
    };

    return (
        <Container>
            <PageTitle>
                User
                <PageSubTitle>Create</PageSubTitle>
            </PageTitle>

            <CreateUserForm
                onSubmit={onSubmit}
                options={
                    <ButtonLink href="/user" variant="secondary">
                        Cancel
                    </ButtonLink>
                }
            />
        </Container>
    );
};

CreateUser.meta = {
    title: 'Create User'
};

CreateUser.auth = isUserAdministrator;

export default CreateUser;
