import { useRouter } from 'next/router';
import { useForgotPasswordMutation } from '@/redux/api';
import { Meta } from '@/components/Meta/Meta';
import { Container } from '@/components/Container/Container';
import { PageTitle } from '@/components/PageTitle/PageTitle';
import {
    ForgotPasswordForm,
    ForgotPasswordFormValues
} from '@/features/account/ForgotPasswordForm/ForgotPasswordForm';

const ForgotPassword = () => {
    const router = useRouter();

    const [forgotPassword] = useForgotPasswordMutation();

    const onSubmit = async (values: ForgotPasswordFormValues) => {
        await forgotPassword(values).unwrap();
        await router.push('/login');
    };

    return (
        <>
            <Meta title="Forgot Password" />

            <Container>
                <PageTitle>Forgot Password</PageTitle>
                <ForgotPasswordForm onSubmit={onSubmit} />
            </Container>
        </>
    );
};

export default ForgotPassword;
