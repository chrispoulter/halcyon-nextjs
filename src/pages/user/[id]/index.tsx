import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { useRouter } from 'next/router';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
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
import { getUser, useGetUser } from '@/hooks/useGetUser';
import { useUpdateUser } from '@/hooks/useUpdateUser';
import { useDeleteUser } from '@/hooks/useDeleteUser';
import { useLockUser } from '@/hooks/useLockUser';
import { useUnlockUser } from '@/hooks/useUnlockUser';
import { isUserAdministrator } from '@/utils/auth';

const UpdateUser = () => {
    const router = useRouter();

    const id = router.query.id as string;

    const { user } = useGetUser(id);

    const { updateUser } = useUpdateUser(id);

    const { deleteUser, isDeleting } = useDeleteUser(id);

    const { lockUser, isLocking } = useLockUser(id);

    const { unlockUser, isUnlocking } = useUnlockUser(id);

    const onSubmit = async (values: UpdateUserFormValues) => {
        await updateUser(values);
        await router.push('/user');
    };

    const onDelete = async () => {
        await deleteUser();
        await router.push('/user');
    };

    const onLock = () => lockUser();

    const onUnlock = () => unlockUser();

    const options = ({ isSubmitting }: UpdateUserFormState) => (
        <>
            <ButtonLink href="/user" variant="secondary">
                Cancel
            </ButtonLink>

            {user?.isLockedOut ? (
                <ConfirmUnlockUser onConfirm={onUnlock}>
                    <Button
                        variant="warning"
                        loading={isUnlocking}
                        disabled={isDeleting || isLocking || isSubmitting}
                    >
                        Unlock
                    </Button>
                </ConfirmUnlockUser>
            ) : (
                <ConfirmLockUser onConfirm={onLock}>
                    <Button
                        variant="warning"
                        loading={isLocking}
                        disabled={isDeleting || isUnlocking || isSubmitting}
                    >
                        Lock
                    </Button>
                </ConfirmLockUser>
            )}

            <ConfirmDeleteUser onConfirm={onDelete}>
                <Button
                    variant="danger"
                    loading={isDeleting}
                    disabled={isUnlocking || isLocking || isSubmitting}
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
                user={user}
                isDisabled={isUnlocking || isLocking || isDeleting}
                onSubmit={onSubmit}
                options={options}
            />
        </Container>
    );
};

// export const getServerSideProps: GetServerSideProps = async ({
//     req,
//     res,
//     params
// }) => {
//     const session = await getServerSession(req, res, authOptions);

//     const id = params?.id as string;

//     const queryClient = new QueryClient();

//     await queryClient.prefetchQuery(['user', id], () =>
//         getUser(id, {
//             headers: {
//                 cookie: req.headers.cookie!
//             }
//         })
//     );

//     return {
//         props: {
//             session,
//             dehydratedState: dehydrate(queryClient)
//         }
//     };
// };

UpdateUser.meta = {
    title: 'Update User'
};

UpdateUser.auth = isUserAdministrator;

export default UpdateUser;
