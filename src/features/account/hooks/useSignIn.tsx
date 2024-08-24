import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';

type SignInRequest = {
    emailAddress: string;
    password: string;
};

export const useSignIn = () => {
    const router = useRouter();

    const callbackUrl = (router.query.callbackUrl as string) || '/';

    return async (values: SignInRequest) => {
        const result = await signIn('credentials', {
            ...values,
            redirect: false,
            callbackUrl
        });

        if (!result?.ok) {
            return toast.error(
                result?.error ||
                    'Sorry, something went wrong. Please try again later.'
            );
        }

        return router.push(result.url!);
    };
};
