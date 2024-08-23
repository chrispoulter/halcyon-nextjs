import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { Meta } from '@/components/Meta/Meta';
import { Container } from '@/components/Container/Container';
import { Title } from '@/components/Title/Title';
import {
    ResetPasswordForm,
    ResetPasswordFormValues
} from '@/features/account/ResetPasswordForm/ResetPasswordForm';
import { useResetPassword } from '@/features/account/hooks/useResetPassword';

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
                    await router.push('/login');
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
