import { useRouter } from 'next/router';
import {
    useDeleteUserMutation,
    useGetUserQuery,
    useLockUserMutation,
    useUnlockUserMutation,
    useUpdateUserMutation
} from '@/redux/api';
import { Container } from '@/components/Container/Container';
import { PageSubTitle, PageTitle } from '@/components/PageTitle/PageTitle';
import { ButtonLink } from '@/components/ButtonLink/ButtonLink';
import { Button } from '@/components/Button/Button';
import { ConfirmUnlockUser } from '@/features/user/ConfirmUnlockUser/ConfirmUnlockUser';
import { ConfirmLockUser } from '@/features/user/ConfirmLockUser/ConfirmLockUser';
import { ConfirmDeleteUser } from '@/features/user/ConfirmDeleteUser/ConfirmDeleteUser';
import {
    UpdateUserForm,
    UpdateUserFormState,
    UpdateUserFormValues
} from '@/features/user/UpdateUserForm/UpdateUserForm';
import { isUserAdministrator } from '@/utils/auth';

import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { getUser } from '@/redux/api';
import { wrapper } from '@/redux/store';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { isAuthorized } from '@/utils/auth';

const UpdateUser = () => {
    const router = useRouter();

    const id = router.query.id as string;

    const { data: user, isFetching } = useGetUserQuery(id, {
        skip: !router.isReady
    });

    const [updateUser] = useUpdateUserMutation();

    const [lockUser, { isLoading: isLocking }] = useLockUserMutation();

    const [unlockUser, { isLoading: isUnlocking }] = useUnlockUserMutation();

    const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

    const version = user?.data?.version;

    const onSubmit = async (values: UpdateUserFormValues) => {
        await updateUser({
            id,
            body: { ...values, version }
        }).unwrap();

        await router.push('/user');
    };

    const onDelete = async () => {
        await deleteUser({
            id,
            body: { version }
        }).unwrap();

        await router.push('/user');
    };

    const onLock = () =>
        lockUser({
            id,
            body: { version }
        });

    const onUnlock = () =>
        unlockUser({
            id,
            body: { version }
        });

    const options = ({ isSubmitting }: UpdateUserFormState) => (
        <>
            <ButtonLink href="/user" variant="secondary">
                Cancel
            </ButtonLink>

            {user?.data?.isLockedOut ? (
                <ConfirmUnlockUser onConfirm={onUnlock}>
                    <Button
                        variant="warning"
                        loading={isUnlocking}
                        disabled={
                            isDeleting ||
                            isLocking ||
                            isSubmitting ||
                            isFetching
                        }
                    >
                        Unlock
                    </Button>
                </ConfirmUnlockUser>
            ) : (
                <ConfirmLockUser onConfirm={onLock}>
                    <Button
                        variant="warning"
                        loading={isLocking}
                        disabled={
                            isDeleting ||
                            isUnlocking ||
                            isSubmitting ||
                            isFetching
                        }
                    >
                        Lock
                    </Button>
                </ConfirmLockUser>
            )}

            <ConfirmDeleteUser onConfirm={onDelete}>
                <Button
                    variant="danger"
                    loading={isDeleting}
                    disabled={
                        isUnlocking || isLocking || isSubmitting || isFetching
                    }
                >
                    Delete
                </Button>
            </ConfirmDeleteUser>
        </>
    );

    return (
        <Container>
            <PageTitle>
                User
                <PageSubTitle>Update</PageSubTitle>
            </PageTitle>

            <UpdateUserForm
                user={user?.data}
                isDisabled={
                    isUnlocking || isLocking || isDeleting || isFetching
                }
                onSubmit={onSubmit}
                options={options}
            />
        </Container>
    );
};

export const getServerSideProps: GetServerSideProps =
    wrapper.getServerSideProps(store => async ({ req, res, params }) => {
        const session = await getServerSession(req, res, authOptions);

        if (!session?.user) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false
                }
            };
        }

        const canViewPage = isAuthorized(session?.user, isUserAdministrator);

        if (!canViewPage) {
            return {
                redirect: {
                    destination: '/403',
                    permanent: false
                }
            };
        }

        const id = params?.id as string;

        const result = await store.dispatch(getUser.initiate(id));

        if (!result.data?.data) {
            return {
                notFound: true
            };
        }

        return {
            props: {
                session
            }
        };
    });

UpdateUser.meta = {
    title: 'Update User'
};

UpdateUser.auth = isUserAdministrator;

export default UpdateUser;
