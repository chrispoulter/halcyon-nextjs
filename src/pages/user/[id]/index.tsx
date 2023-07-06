import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
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

const UpdateUser = () => {
    const router = useRouter();

    const id = router.query.id as string;

    const { data: user } = useGetUserQuery(id, { skip: !router.isReady });

    const [updateUser] = useUpdateUserMutation();

    const [lockUser, { isLoading: isLocking }] = useLockUserMutation();

    const [unlockUser, { isLoading: isUnlocking }] = useUnlockUserMutation();

    const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

    const version = user?.data?.version;

    const onSubmit = async (values: UpdateUserFormValues) => {
        const result = await updateUser({
            id,
            body: { ...values, version }
        }).unwrap();

        toast.success(result.message!);
        await router.push('/user');
    };

    const onDelete = async () => {
        try {
            const result = await deleteUser({
                id,
                body: { version }
            }).unwrap();

            toast.success(result.message!);
            await router.push('/user');
        } catch (error) {
            console.warn(
                'An unhandled error was caught from onDelete()',
                error
            );
        }
    };

    const onLock = async () => {
        try {
            const result = await lockUser({
                id,
                body: { version }
            }).unwrap();

            toast.success(result.message!);
        } catch (error) {
            console.warn('An unhandled error was caught from onLock()', error);
        }
    };

    const onUnlock = async () => {
        try {
            const result = await unlockUser({
                id,
                body: { version }
            }).unwrap();

            toast.success(result.message!);
        } catch (error) {
            console.warn(
                'An unhandled error was caught from onUnlock()',
                error
            );
        }
    };

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
                user={user?.data}
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

//     const baseUrl = getBaseUrl(req);

//     await queryClient.prefetchQuery(['user', id], () =>
//         getUser(
//             id,
//             {
//                 headers: {
//                     cookie: req.headers.cookie!
//                 }
//             },
//             baseUrl
//         )
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
