import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';
import { useRegisterMutation } from '@/features/account/accountEndpoints';
import { Meta } from '@/components/Meta/Meta';
import { Container } from '@/components/Container/Container';
import { Title } from '@/components/Title/Title';
import { TextLink } from '@/components/TextLink/TextLink';
import {
    RegisterForm,
    RegisterFormValues
} from '@/features/account/RegisterForm/RegisterForm';

const RegisterPage = () => {
    const router = useRouter();

    const [register] = useRegisterMutation();

    const onSubmit = async (values: RegisterFormValues) => {
        await register(values).unwrap();

        toast.success('User successfully registered.');

        const result = await signIn('credentials', {
            ...values,
            redirect: false
        });

        if (result?.ok) {
            return router.push('/');
        }

        return toast.error('The credentials provided were invalid.');
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
