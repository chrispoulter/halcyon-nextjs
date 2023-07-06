import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { useResetPasswordMutation } from '@/redux/api';
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
        const result = await resetPassword({
            token,
            ...values
        }).unwrap();

        toast.success(result.message!);
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
