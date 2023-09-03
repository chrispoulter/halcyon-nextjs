import { signIn } from 'next-auth/react';
import { useRegisterMutation } from '@/redux/api';
import { Meta } from '@/components/Meta/Meta';
import { Container } from '@/components/Container/Container';
import { Title } from '@/components/Title/Title';
import { TextLink } from '@/components/TextLink/TextLink';
import {
    RegisterForm,
    RegisterFormValues
} from '@/features/account/RegisterForm/RegisterForm';

const RegisterPage = () => {
    const [register] = useRegisterMutation();

    const onSubmit = async (values: RegisterFormValues) => {
        await register(values).unwrap();
        await signIn('credentials', { ...values, callbackUrl: '/' });
    };

    return (
        <>
            <Meta title="Register" />

            <Container>
                <Title>Register</Title>
                <RegisterForm onSubmit={onSubmit} className="mb-5" />

                <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <TextLink href="/login">Log in now</TextLink>
                </p>
            </Container>
        </>
    );
};

export default RegisterPage;
