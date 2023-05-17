import { signIn } from 'next-auth/react';
import { Container } from '@/components/Container/Container';
import { PageTitle } from '@/components/PageTitle/PageTitle';
import { BodyLink } from '@/components/BodyLink/BodyLink';
import {
    RegisterForm,
    RegisterFormValues
} from '@/features/account/RegisterForm/RegisterForm';
import { useRegister } from '@/hooks/useRegister';

const Register = () => {
    const { register } = useRegister();

    const onSubmit = async (values: RegisterFormValues) => {
        await register(values);
        signIn('credentials', { ...values, callbackUrl: '/' });
    };

    return (
        <Container>
            <PageTitle>Register</PageTitle>
            <RegisterForm onSubmit={onSubmit} className="mb-5" />

            <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <BodyLink href="/login">Log in now</BodyLink>
            </p>
        </Container>
    );
};

Register.meta = {
    title: 'Register'
};

export default Register;
