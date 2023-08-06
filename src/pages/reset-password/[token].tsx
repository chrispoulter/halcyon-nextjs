import { useRouter } from 'next/router';
import { useResetPasswordMutation } from '@/redux/api';
import { Meta } from '@/components/Meta/Meta';
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
        }).unwrap();

        await router.push('/login');
    };

    return (
        <>
            <Meta title="Reset Password" />

            <Container>
                <PageTitle>Reset Password</PageTitle>
                <ResetPasswordForm onSubmit={onSubmit} />
            </Container>
        </>
    );
};

export default ResetPassword;
