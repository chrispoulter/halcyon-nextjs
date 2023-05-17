import { useRouter } from 'next/router';
import { Container } from '@/components/Container/Container';
import { PageTitle } from '@/components/PageTitle/PageTitle';
import {
    ResetPasswordForm,
    ResetPasswordFormValues
} from '@/features/account/ResetPasswordForm/ResetPasswordForm';
import { useResetPassword } from '@/hooks/useResetPassword';

const ResetPassword = () => {
    const router = useRouter();

    const token = router.query.token as string;

    const { resetPassword } = useResetPassword();

    const onSubmit = async (values: ResetPasswordFormValues) => {
        await resetPassword({
            token,
            ...values
        });

        await router.push('/login');
    };

    return (
        <Container>
            <PageTitle>Reset Password</PageTitle>
            <ResetPasswordForm onSubmit={onSubmit} />
        </Container>
    );
};

ResetPassword.meta = {
    title: 'Reset Password'
};

export default ResetPassword;
