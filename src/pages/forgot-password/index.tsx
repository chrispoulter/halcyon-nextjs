import { useRouter } from 'next/router';
import { Container } from '@/components/Container/Container';
import { PageTitle } from '@/components/PageTitle/PageTitle';
import {
    ForgotPasswordForm,
    ForgotPasswordFormValues
} from '@/features/account/ForgotPasswordForm/ForgotPasswordForm';
import { useForgotPassword } from '@/hooks/useForgotPassword';

const ForgotPassword = () => {
    const router = useRouter();

    const { forgotPassword } = useForgotPassword();

    const onSubmit = async (values: ForgotPasswordFormValues) => {
        await forgotPassword(values);
        await router.push('/login');
    };

    return (
        <Container>
            <PageTitle>Forgot Password</PageTitle>
            <ForgotPasswordForm onSubmit={onSubmit} />
        </Container>
    );
};

ForgotPassword.meta = {
    title: 'Forgot Password'
};

export default ForgotPassword;
