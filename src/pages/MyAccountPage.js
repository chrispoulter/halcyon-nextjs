import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useQuery, useMutation } from '@apollo/react-hooks';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import { GET_PROFILE, DELETE_ACCOUNT } from '../graphql';
import { Button, Spinner, useModal, useAuth, useToast } from '../components';
import { trackEvent, captureError } from '../utils/logger';

export const MyAccountPage = ({ history }) => {
    const { removeToken } = useAuth();

    const { showModal } = useModal();

    const toast = useToast();

    const { loading, data } = useQuery(GET_PROFILE);

    const [deleteAccount, { loading: isDeleting }] =
        useMutation(DELETE_ACCOUNT);

    if (loading) {
        return <Spinner />;
    }

    if (!data?.getProfile) {
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
            onOpen: () =>
                trackEvent('screen_view', {
                    screen_name: 'delete-account-modal'
                }),
            onOk: async () => {
                try {
                    const result = await deleteAccount();

                    toast.success(result.data.deleteAccount.message);

                    trackEvent('account_deleted', {
                        entityId: result.data.deleteAccount.user.id
                    });

                    removeToken();
                    history.push('/');
                } catch (error) {
                    captureError(error);
                }
            }
        });

    return (
        <Container>
            <Helmet>
                <title>My Account</title>
            </Helmet>

            <h1>My Account</h1>
            <hr />

            <div className="d-flex justify-content-between">
                <h3>Profile</h3>
                <Button to="/update-profile" as={Link} variant="primary">
                    Update
                </Button>
            </div>
            <hr />

            <p>
                <span className="text-muted">Email Address</span>
                <br />
                {data.getProfile.emailAddress}
            </p>

            <p>
                <span className="text-muted">Password</span>
                <br />
                ********
                <br />
                <Link to="/change-password">Change your password...</Link>
            </p>

            <p>
                <span className="text-muted">Name</span>
                <br />
                {data.getProfile.firstName} {data.getProfile.lastName}
            </p>

            <p>
                <span className="text-muted">Date Of Birth</span>
                <br />
                {new Date(data.getProfile.dateOfBirth).toLocaleDateString(
                    'en',
                    {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                    }
                )}
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
