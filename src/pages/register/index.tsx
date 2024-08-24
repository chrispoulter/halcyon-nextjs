import toast from 'react-hot-toast';
import { Meta } from '@/components/Meta/Meta';
import { Container } from '@/components/Container/Container';
import { Title } from '@/components/Title/Title';
import { TextLink } from '@/components/TextLink/TextLink';
import {
    RegisterForm,
    RegisterFormValues
} from '@/features/account/RegisterForm/RegisterForm';
import { useRegister } from '@/features/account/hooks/useRegister';
import { useSignIn } from '@/features/account/hooks/useSignIn';

const RegisterPage = () => {
    const { mutate, isPending } = useRegister();

    const signIn = useSignIn();

    const onSubmit = (values: RegisterFormValues) =>
        mutate(values, {
            onSuccess: async () => {
                toast.success('User successfully registered.');
                await signIn(values);
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
