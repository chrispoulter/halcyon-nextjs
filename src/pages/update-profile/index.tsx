import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { useRouter } from 'next/router';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Container } from '@/components/Container/Container';
import { PageTitle } from '@/components/PageTitle/PageTitle';
import { ButtonLink } from '@/components/ButtonLink/ButtonLink';
import {
    UpdateProfileForm,
    UpdateProfileFormValues
} from '@/features/manage/UpdateProfileForm/UpdateProfileForm';
import { getProfile, useGetProfile } from '@/hooks/useGetProfile';
import { useUpdateProfile } from '@/hooks/useUpdateProfile';
import { getBaseUrl } from '@/utils/url';

const UpdateProfile = () => {
    const router = useRouter();

    const { profile } = useGetProfile();

    const { updateProfile } = useUpdateProfile();

    const onSubmit = async (values: UpdateProfileFormValues) => {
        try {
            await updateProfile({ ...values, version: profile!.version });
            await router.push('/my-account');
        } catch (error) {
            console.warn(
                'An unhandled error was caught from onSubmit()',
                error
            );
        }
    };

    return (
        <Container>
            <PageTitle>Update Profile</PageTitle>

            <UpdateProfileForm
                profile={profile}
                onSubmit={onSubmit}
                options={
                    <ButtonLink href="/my-account" variant="secondary">
                        Cancel
                    </ButtonLink>
                }
            />
        </Container>
    );
};

// export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
//     const session = await getServerSession(req, res, authOptions);

//     const queryClient = new QueryClient();

//     const baseUrl = getBaseUrl(req);

//     await queryClient.prefetchQuery(['profile'], () =>
//         getProfile({
//             headers: {
//                 cookie: req.headers.cookie!
//             }
//         },
//         baseUrl)
//     );

//     return {
//         props: {
//             session,
//             dehydratedState: dehydrate(queryClient)
//         }
//     };
// };

UpdateProfile.meta = {
    title: 'Update Profile'
};

UpdateProfile.auth = true;

export default UpdateProfile;
