import { signIn } from 'next-auth/react';
import { useRegisterMutation } from '@/redux/halcyonApi';
import { Container } from '@/components/Container/Container';
import { PageTitle } from '@/components/PageTitle/PageTitle';
import { BodyLink } from '@/components/BodyLink/BodyLink';
import {
    RegisterForm,
    RegisterFormValues
} from '@/features/account/RegisterForm/RegisterForm';

const Register = () => {
    const [register] = useRegisterMutation();

    const onSubmit = async (values: RegisterFormValues) => {
        await register(values);
        await signIn('credentials', { ...values, callbackUrl: '/' });
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
