import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Meta } from '@/components/meta';
import { Container } from '@/components/container';
import { Title } from '@/components/title';
import { TextLink } from '@/components/text-link';
import {
    RegisterForm,
    RegisterFormValues
} from '@/features/account/components/register-form';
import { useRegister } from '@/features/account/hooks/use-register';

const RegisterPage = () => {
    const router = useRouter();

    const { mutate, isPending } = useRegister();

    const onSubmit = (values: RegisterFormValues) =>
        mutate(values, {
            onSuccess: async () => {
                toast.success('User successfully registered.');

                const signInResult = await signIn('credentials', {
                    ...values,
                    redirect: false
                });

                if (signInResult?.ok) {
                    return router.push('/');
                }

                return toast.error('The credentials provided were invalid.');
            }
        });

    return (
        <>
            <Meta title="Register" />

            <Container>
                <Title>Register</Title>
                <RegisterForm
                    isLoading={isPending}
                    onSubmit={onSubmit}
                    className="mb-5"
                />

                <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <TextLink href="/login">Log in now</TextLink>
                </p>
            </Container>
        </>
    );
};

export default RegisterPage;
