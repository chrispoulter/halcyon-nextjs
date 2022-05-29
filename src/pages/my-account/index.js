import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import { Button, Spinner, Meta } from '../../components';
import { useModal, useAuth, useToast } from '../../contexts';
import { useGetProfile, useDeleteAccount } from '../../services';

export const MyAccountPage = () => {
    const router = useRouter();

    const { removeToken } = useAuth();

    const { showModal } = useModal();

    const toast = useToast();

    const { loading, data } = useGetProfile();

    const { request: deleteAccount, loading: isDeleting } = useDeleteAccount();

    if (loading) {
        return <Spinner />;
    }

    if (!data) {
        return (
            <Container>
                <Alert variant="info">Profile could not be found.</Alert>
            </Container>
        );
    }

    const onDeleteAccount = () =>
        showModal({
            title: 'Confirm',
            body: 'Are you sure you want to delete your account?',
            onOk: async () => {
                const result = await deleteAccount();

                if (result.ok) {
                    toast.success(result.message);
                    removeToken();
                    router.push('/');
                }
            }
        });

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
                {data.emailAddress}
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
                {data.firstName} {data.lastName}
            </p>

            <p>
                <span className="text-muted">Date Of Birth</span>
                <br />
                {new Date(data.dateOfBirth).toLocaleDateString('en', {
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

export default MyAccountPage;
