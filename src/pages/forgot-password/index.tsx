import { useRouter } from 'next/router';
import { useForgotPasswordMutation } from '@/redux/api';
import { Meta } from '@/components/Meta/Meta';
import { Container } from '@/components/Container/Container';
import { Title } from '@/components/Title/Title';
import {
    ForgotPasswordForm,
    ForgotPasswordFormValues
} from '@/features/account/ForgotPasswordForm/ForgotPasswordForm';

const ForgotPasswordPage = () => {
    const router = useRouter();

    const [forgotPassword] = useForgotPasswordMutation();

    const onSubmit = async (values: ForgotPasswordFormValues) => {
        await forgotPassword({
            ...values,
            siteUrl: window.location.origin
        }).unwrap();

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
