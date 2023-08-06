import { signIn } from 'next-auth/react';
import { useRegisterMutation } from '@/redux/api';
import { Meta } from '@/components/Meta/Meta';
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
        await register(values).unwrap();
        await signIn('credentials', { ...values, callbackUrl: '/' });
    };

    return (
        <>
            <Meta title="Register" />

            <Container>
                <PageTitle>Register</PageTitle>
                <RegisterForm onSubmit={onSubmit} className="mb-5" />

                <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <BodyLink href="/login">Log in now</BodyLink>
                </p>
            </Container>
        </>
    );
};

export default Register;
