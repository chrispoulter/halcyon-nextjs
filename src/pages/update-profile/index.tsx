import { useRouter } from 'next/router';
import { useGetProfileQuery, useUpdateProfileMutation } from '@/redux/api';
import { Container } from '@/components/Container/Container';
import { PageTitle } from '@/components/PageTitle/PageTitle';
import { ButtonLink } from '@/components/ButtonLink/ButtonLink';
import {
    UpdateProfileForm,
    UpdateProfileFormValues
} from '@/features/manage/UpdateProfileForm/UpdateProfileForm';

const UpdateProfile = () => {
    const router = useRouter();

    const { data: profile } = useGetProfileQuery();

    const [updateProfile] = useUpdateProfileMutation();

    const version = profile?.data?.version;

    const onSubmit = async (values: UpdateProfileFormValues) => {
        await updateProfile({ ...values, version }).unwrap();
        await router.push('/my-account');
    };

    return (
        <Container>
            <PageTitle>Update Profile</PageTitle>

            <UpdateProfileForm
                profile={profile?.data}
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
