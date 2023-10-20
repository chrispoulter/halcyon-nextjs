import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import {
    useDeleteUserMutation,
    useGetUserQuery,
    useLockUserMutation,
    useUnlockUserMutation,
    useUpdateUserMutation
} from '@/redux/api';
import { Meta } from '@/components/Meta/Meta';
import { Container } from '@/components/Container/Container';
import { SubTitle, Title } from '@/components/Title/Title';
import { ButtonLink } from '@/components/ButtonLink/ButtonLink';
import { ConfirmUnlockUser } from '@/features/user/ConfirmUnlockUser/ConfirmUnlockUser';
import { ConfirmLockUser } from '@/features/user/ConfirmLockUser/ConfirmLockUser';
import { ConfirmDeleteUser } from '@/features/user/ConfirmDeleteUser/ConfirmDeleteUser';
import {
    UpdateUserForm,
    UpdateUserFormState,
    UpdateUserFormValues
} from '@/features/user/UpdateUserForm/UpdateUserForm';

import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { getUser, getRunningQueriesThunk } from '@/redux/api';
import { wrapper } from '@/redux/store';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

const UpdateUserPage = () => {
    const router = useRouter();

    const id = router.query.id as string;

    const { data: user, isFetching } = useGetUserQuery(id, {
        skip: !router.isReady
    });

    const [updateUser] = useUpdateUserMutation();

    const [lockUser, { isLoading: isLocking }] = useLockUserMutation();

    const [unlockUser, { isLoading: isUnlocking }] = useUnlockUserMutation();

    const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

    const version = user?.version;

    const onSubmit = async (values: UpdateUserFormValues) => {
        await updateUser({
            id,
            body: { ...values, version }
        }).unwrap();

        toast.success('User successfully updated.');
        await router.push('/user');
    };

    const onDelete = async () => {
        await deleteUser({
            id,
            body: { version }
        }).unwrap();

        toast.success('User successfully deleted.');
        await router.push('/user');
    };

    const onLock = async () => {
        await lockUser({
            id,
            body: { version }
        }).unwrap();

        toast.success('User successfully locked.');
    };

    const onUnlock = async () => {
        await unlockUser({
            id,
            body: { version }
        }).unwrap();

        toast.success('User successfully unlocked.');
    };

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
                        isDeleting || isLocking || isSubmitting || isFetching
                    }
                />
            ) : (
                <ConfirmLockUser
                    onConfirm={onLock}
                    loading={isLocking}
                    disabled={
                        isDeleting || isUnlocking || isSubmitting || isFetching
                    }
                />
            )}

            <ConfirmDeleteUser
                onConfirm={onDelete}
                loading={isDeleting}
                disabled={
                    isUnlocking || isLocking || isSubmitting || isFetching
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

export const getServerSideProps: GetServerSideProps =
    wrapper.getServerSideProps(store => async ({ req, res, params }) => {
        const session = await getServerSession(req, res, authOptions);

        const id = params?.id as string;

        store.dispatch(getUser.initiate(id));

        await Promise.all(store.dispatch(getRunningQueriesThunk()));

        return {
            props: {
                session
            }
        };
    });

export default UpdateUserPage;
