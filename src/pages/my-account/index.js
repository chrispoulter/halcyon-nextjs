import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import { Button, Spinner, Meta } from '../../components';
import {
    useGetProfileQuery,
    useDeleteAccountMutation,
    showToast,
    showModal,
    removeToken
} from '../../redux';

export const MyAccountPage = () => {
    const router = useRouter();

    const dispatch = useDispatch();

    const { isFetching, data: profile } = useGetProfileQuery();

    const [deleteAccount, { isLoading: isDeleting }] =
        useDeleteAccountMutation();

    if (isFetching) {
        return <Spinner />;
    }

    if (!profile?.data) {
        return (
            <Container>
                <Alert variant="info">Profile could not be found.</Alert>
            </Container>
        );
    }

    const onDeleteAccount = () =>
        dispatch(
            showModal({
                title: 'Confirm',
                body: 'Are you sure you want to delete your account?',
                onOk: async () => {
                    const { data: result } = await deleteAccount();

                    if (result) {
                        dispatch(
                            showToast({
                                variant: 'success',
                                message: result.message
                            })
                        );

                        dispatch(removeToken());

                        router.push('/');
                    }
                }
            })
        );

    return (
        <Container>
            <Meta title="My Account" />

            <h1>My Account</h1>
            <hr />

            <div className="d-flex justify-content-between">
                <h3>Profile</h3>
                <Link href="/update-profile" passHref>
                    <Button variant="primary">Update</Button>
                </Link>
            </div>
            <hr />

            <p>
                <span className="text-muted">Email Address</span>
                <br />
                {profile.data.emailAddress}
            </p>

            <p>
                <span className="text-muted">Password</span>
                <br />
                ********
                <br />
                <Link href="/change-password">Change your password...</Link>
            </p>

            <p>
                <span className="text-muted">Name</span>
                <br />
                {profile.data.firstName} {profile.data.lastName}
            </p>

            <p>
                <span className="text-muted">Date Of Birth</span>
                <br />
                {new Date(profile.data.dateOfBirth).toLocaleDateString('en', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                })}
            </p>

            <h3>Settings</h3>
            <hr />
            <p>
                Once you delete your account all of your data and settings will
                be removed. Please be certain.
            </p>
            <p>
                <Button
                    variant="danger"
                    loading={isDeleting}
                    onClick={onDeleteAccount}
                >
                    Delete Account
                </Button>
            </p>
        </Container>
    );
};

MyAccountPage.auth = true;

export default MyAccountPage;
