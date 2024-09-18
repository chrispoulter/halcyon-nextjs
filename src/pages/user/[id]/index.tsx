import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Meta } from '@/components/meta';
import { Container } from '@/components/container';
import { SubTitle, Title } from '@/components/title';
import { ButtonLink } from '@/components/button-link';
import { ConfirmUnlockUser } from '@/features/user/components/confirm-unlock-user';
import { ConfirmLockUser } from '@/features/user/components/confirm-lock-user';
import { ConfirmDeleteUser } from '@/features/user/components/confirm-delete-user';
import {
    UpdateUserForm,
    UpdateUserFormValues
} from '@/features/user/components/update-user-form';
import { getUser, useGetUser } from '@/features/user/hooks/use-get-user';
import { useUpdateUser } from '@/features/user/hooks/use-update-user';
import { useLockUser } from '@/features/user/hooks/use-lock-user';
import { useUnlockUser } from '@/features/user/hooks/use-unlock-user';
import { useDeleteUser } from '@/features/user/hooks/use-delete-user';
import { auth } from '@/lib/auth';

const UpdateUserPage = () => {
    const router = useRouter();
    const id = router.query.id as string;

    const { data, isFetching } = useGetUser(id, router.isReady);

    const version = data?.version;

    const { mutate, isPending } = useUpdateUser(id);

    const { mutate: lockUser, isPending: isLocking } = useLockUser(id);

    const { mutate: unlockUser, isPending: isUnlocking } = useUnlockUser(id);

    const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser(id);

    const onSubmit = async (values: UpdateUserFormValues) =>
        mutate(
            { ...values, version },
            {
                onSuccess: async () => {
                    toast.success('User successfully updated.');
                    return router.push('/user');
                }
            }
        );

    const onDelete = () =>
        deleteUser(
            { version },
            {
                onSuccess: async () => {
                    toast.success('User successfully deleted.');
                    return router.push('/user');
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

    return (
        <>
            <Meta title="Update User" />

            <Container>
                <Title>
                    User
                    <SubTitle>Update</SubTitle>
                </Title>

                <UpdateUserForm
                    user={data}
                    isLoading={isPending}
                    isDisabled={
                        isUnlocking || isLocking || isDeleting || isFetching
                    }
                    onSubmit={onSubmit}
                    options={
                        <>
                            <ButtonLink href="/user" variant="secondary">
                                Cancel
                            </ButtonLink>

                            {data?.isLockedOut ? (
                                <ConfirmUnlockUser
                                    onConfirm={onUnlock}
                                    loading={isUnlocking}
                                    disabled={
                                        isPending ||
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
                                        isPending ||
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
                                    isPending ||
                                    isUnlocking ||
                                    isLocking ||
                                    isFetching
                                }
                            />
                        </>
                    }
                />
            </Container>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async context => {
    const session = await auth(context);

    const id = context.params?.id as string;

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
