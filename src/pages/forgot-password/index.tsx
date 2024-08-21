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

    const { forgotPassword } = useForgotPassword();

    const onSubmit = async (values: ForgotPasswordFormValues) => {
        await forgotPassword({
            ...values,
            siteUrl: window.location.origin
        });

        toast.success(
            'Instructions as to how to reset your password have been sent to you via email.'
        );

        await router.push('/login');
    };

    return (
        <>
            <Meta title="Forgot Password" />

            <Container>
                <Title>Forgot Password</Title>
                <ForgotPasswordForm onSubmit={onSubmit} />
            </Container>
        </>
    );
};

export default ForgotPasswordPage;
