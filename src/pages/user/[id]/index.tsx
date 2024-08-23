import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Meta } from '@/components/Meta/Meta';
import { Container } from '@/components/Container/Container';
import { SubTitle, Title } from '@/components/Title/Title';
import { ButtonLink } from '@/components/Button/ButtonLink';
import { ConfirmUnlockUser } from '@/features/user/ConfirmUnlockUser/ConfirmUnlockUser';
import { ConfirmLockUser } from '@/features/user/ConfirmLockUser/ConfirmLockUser';
import { ConfirmDeleteUser } from '@/features/user/ConfirmDeleteUser/ConfirmDeleteUser';
import {
    UpdateUserForm,
    UpdateUserFormState,
    UpdateUserFormValues
} from '@/features/user/UpdateUserForm/UpdateUserForm';
import { getUser, useGetUser } from '@/features/user/hooks/useGetUser';
import { useUpdateUser } from '@/features/user/hooks/useUpdateUser';
import { useLockUser } from '@/features/user/hooks/useLockUser';
import { useUnlockUser } from '@/features/user/hooks/useUnlockUser';
import { useDeleteUser } from '@/features/user/hooks/useDeleteUser';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

const UpdateUserPage = () => {
    const router = useRouter();

    const id = router.query.id as string;

    const { user, isFetching } = useGetUser(id);

    const { updateUser, isSaving } = useUpdateUser(id);

    const { lockUser, isLocking } = useLockUser(id);

    const { unlockUser, isUnlocking } = useUnlockUser(id);

    const { deleteUser, isDeleting } = useDeleteUser(id);

    const version = user?.version;

    const onSubmit = async (values: UpdateUserFormValues) =>
        updateUser(
            { ...values, version },
            {
                onSuccess: async () => {
                    toast.success('User successfully updated.');
                    await router.push('/user');
                }
            }
        );

    const onDelete = () =>
        deleteUser(
            { version },
            {
                onSuccess: async () => {
                    toast.success('User successfully deleted.');
                    await router.push('/user');
                }
            }
        );

    const onLock = () =>
        lockUser(
            { version },
            {
                onSuccess: () => toast.success('User successfully locked.')
            }
        );

    const onUnlock = () =>
        unlockUser(
            { version },
            {
                onSuccess: () => toast.success('User successfully unlocked.')
            }
        );

    const options = ({ isSubmitting }: UpdateUserFormState) => (
        <>
            <ButtonLink href="/user" variant="secondary">
                Cancel
            </ButtonLink>

            {user?.isLockedOut ? (
                <ConfirmUnlockUser
                    onConfirm={onUnlock}
                    loading={isUnlocking}
                    disabled={
                        isSubmitting ||
                        isSaving ||
                        isDeleting ||
                        isLocking ||
                        isFetching
                    }
                />
            ) : (
                <ConfirmLockUser
                    onConfirm={onLock}
                    loading={isLocking}
                    disabled={
                        isSubmitting ||
                        isSaving ||
                        isDeleting ||
                        isUnlocking ||
                        isFetching
                    }
                />
            )}

            <ConfirmDeleteUser
                onConfirm={onDelete}
                loading={isDeleting}
                disabled={
                    isSubmitting ||
                    isSaving ||
                    isUnlocking ||
                    isLocking ||
                    isFetching
                }
            />
        </>
    );

    return (
        <>
            <Meta title="Update User" />

            <Container>
                <Title>
                    User
                    <SubTitle>Update</SubTitle>
                </Title>

                <UpdateUserForm
                    user={user}
                    isLoading={isSaving}
                    isDisabled={
                        isUnlocking || isLocking || isDeleting || isFetching
                    }
                    onSubmit={onSubmit}
                    options={options}
                />
            </Container>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async ({
    req,
    res,
    params
}) => {
    const session = await getServerSession(req, res, authOptions);

    const id = params?.id as string;

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['user', id],
        queryFn: () =>
            getUser(id, {
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`
                }
            })
    });

    return {
        props: {
            session,
            dehydratedState: dehydrate(queryClient)
        }
    };
};

export default UpdateUserPage;
