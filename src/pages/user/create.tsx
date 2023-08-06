import { useRouter } from 'next/router';
import { useCreateUserMutation } from '@/redux/api';
import { Meta } from '@/components/Meta/Meta';
import { Container } from '@/components/Container/Container';
import { PageTitle, PageSubTitle } from '@/components/PageTitle/PageTitle';
import { ButtonLink } from '@/components/ButtonLink/ButtonLink';
import {
    CreateUserForm,
    CreateUserFormValues
} from '@/features/user/CreateUserForm/CreateUserForm';

const CreateUser = () => {
    const router = useRouter();

    const [createUser] = useCreateUserMutation();

    const onSubmit = async (values: CreateUserFormValues) => {
        await createUser(values).unwrap();
        await router.push('/user');
    };

    return (
        <>
            <Meta title="Create User" />

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
        </>
    );
};

export default CreateUser;
