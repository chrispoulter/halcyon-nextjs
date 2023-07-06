import { useRouter } from 'next/router';
import { useResetPasswordMutation } from '@/redux/halcyonApi';
import { Container } from '@/components/Container/Container';
import { PageTitle } from '@/components/PageTitle/PageTitle';
import {
    ResetPasswordForm,
    ResetPasswordFormValues
} from '@/features/account/ResetPasswordForm/ResetPasswordForm';

const ResetPassword = () => {
    const router = useRouter();

    const token = router.query.token as string;

    const [resetPassword] = useResetPasswordMutation();

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
