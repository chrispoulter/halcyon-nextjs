import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { Meta } from '@/components/Meta/Meta';
import { Container } from '@/components/Container/Container';
import { Title } from '@/components/Title/Title';
import {
    ForgotPasswordForm,
    ForgotPasswordFormValues
} from '@/features/account/ForgotPasswordForm/ForgotPasswordForm';
import { useForgotPassword } from '@/features/account/hooks/useForgotPassword';

const ForgotPasswordPage = () => {
    const router = useRouter();

    const { mutate, isPending } = useForgotPassword();

    const onSubmit = (values: ForgotPasswordFormValues) =>
        mutate(
            {
                ...values,
                siteUrl: window.location.origin
            },
            {
                onSuccess: async () => {
                    toast.success(
                        'Instructions as to how to reset your password have been sent to you via email.'
                    );

                    return router.push('/login');
                }
            }
        );

    return (
        <>
            <Meta title="Forgot Password" />

            <Container>
                <Title>Forgot Password</Title>
                <ForgotPasswordForm isLoading={isPending} onSubmit={onSubmit} />
            </Container>
        </>
    );
};

export default ForgotPasswordPage;
