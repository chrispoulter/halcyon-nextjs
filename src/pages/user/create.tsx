import { useRouter } from 'next/router';
import { useCreateUserMutation } from '@/redux/api';
import { Meta } from '@/components/Meta/Meta';
import { Container } from '@/components/Container/Container';
import { Title, SubTitle } from '@/components/Title/Title';
import { ButtonLink } from '@/components/ButtonLink/ButtonLink';
import {
    CreateUserForm,
    CreateUserFormValues
} from '@/features/user/CreateUserForm/CreateUserForm';

const CreateUserPage = () => {
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
                <Title>
                    User
                    <SubTitle>Create</SubTitle>
                </Title>

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

export default CreateUserPage;
