import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { Meta } from '@/components/meta';
import { Container } from '@/components/container';
import { Title } from '@/components/title';
import {
    ResetPasswordForm,
    ResetPasswordFormValues
} from '@/features/account/components/reset-password-form';
import { useResetPassword } from '@/features/account/hooks/use-reset-password';

const ResetPasswordPage = () => {
    const router = useRouter();
    const token = router.query.token as string;

    const { mutate, isPending } = useResetPassword();

    const onSubmit = (values: ResetPasswordFormValues) =>
        mutate(
            {
                token,
                ...values
            },
            {
                onSuccess: async () => {
                    toast.success('Your password has been reset.');
                    return router.push('/login');
                }
            }
        );

    return (
        <>
            <Meta title="Reset Password" />

            <Container>
                <Title>Reset Password</Title>
                <ResetPasswordForm isLoading={isPending} onSubmit={onSubmit} />
            </Container>
        </>
    );
};

export default ResetPasswordPage;
