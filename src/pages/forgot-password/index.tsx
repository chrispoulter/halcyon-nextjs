import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { useForgotPasswordMutation } from '@/redux/api';
import { Container } from '@/components/Container/Container';
import { PageTitle } from '@/components/PageTitle/PageTitle';
import {
    ForgotPasswordForm,
    ForgotPasswordFormValues
} from '@/features/account/ForgotPasswordForm/ForgotPasswordForm';

const ForgotPassword = () => {
    const router = useRouter();

    const [forgotPassword] = useForgotPasswordMutation();

    const onSubmit = async (values: ForgotPasswordFormValues) => {
        const result = await forgotPassword(values).unwrap();
        toast.success(result.message!);
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
