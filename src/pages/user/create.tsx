import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { useCreateUserMutation } from '@/redux/api';
import { Container } from '@/components/Container/Container';
import { PageTitle, PageSubTitle } from '@/components/PageTitle/PageTitle';
import { ButtonLink } from '@/components/ButtonLink/ButtonLink';
import {
    CreateUserForm,
    CreateUserFormValues
} from '@/features/user/CreateUserForm/CreateUserForm';
import { isUserAdministrator } from '@/utils/auth';

const CreateUser = () => {
    const router = useRouter();

    const [createUser] = useCreateUserMutation();

    const onSubmit = async (values: CreateUserFormValues) => {
        const result = await createUser(values).unwrap();
        toast.success(result.message!);
        await router.push('/user');
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
