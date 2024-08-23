import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { Meta } from '@/components/Meta/Meta';
import { Container } from '@/components/Container/Container';
import { Title, SubTitle } from '@/components/Title/Title';
import { ButtonLink } from '@/components/Button/ButtonLink';
import {
    CreateUserForm,
    CreateUserFormValues
} from '@/features/user/CreateUserForm/CreateUserForm';
import { useCreateUser } from '@/features/user/hooks/useCreateUser';

const CreateUserPage = () => {
    const router = useRouter();

    const { createUser, isSaving } = useCreateUser();

    const onSubmit = (values: CreateUserFormValues) =>
        createUser(values, {
            onSuccess: async () => {
                toast.success('User successfully created.');
                await router.push('/user');
            }
        });

    return (
        <>
            <Meta title="Create User" />

            <Container>
                <Title>
                    User
                    <SubTitle>Create</SubTitle>
                </Title>

                <CreateUserForm
                    isLoading={isSaving}
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

export default CreateUserPage;
