import { useRouter } from 'next/router';
import { Container } from '@/components/Container/Container';
import { PageTitle } from '@/components/PageTitle/PageTitle';
import { ButtonLink } from '@/components/ButtonLink/ButtonLink';
import {
    UpdateProfileForm,
    UpdateProfileFormValues
} from '@/features/manage/UpdateProfileForm/UpdateProfileForm';
import { useGetProfile } from '@/hooks/useGetProfile';
import { useUpdateProfile } from '@/hooks/useUpdateProfile';

const UpdateProfile = () => {
    const router = useRouter();

    const { profile } = useGetProfile();

    const { updateProfile } = useUpdateProfile();

    const onSubmit = async (values: UpdateProfileFormValues) => {
        await updateProfile(values);
        await router.push('/my-account');
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

UpdateProfile.meta = {
    title: 'Update Profile'
};

UpdateProfile.auth = true;

export default UpdateProfile;
