import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Container, Alert } from 'reactstrap';
import confirm from 'reactstrap-confirm';
import { toast } from 'react-toastify';
import { GET_PROFILE, DELETE_ACCOUNT } from '../graphql';
import { Button, Spinner, AuthContext } from '../components';

export const MyAccountPage = ({ history }) => {
    const { t } = useTranslation();

    const { removeToken } = useContext(AuthContext);

    const { loading, data } = useQuery(GET_PROFILE);

    const [deleteAccount, { loading: isDeleting }] = useMutation(
        DELETE_ACCOUNT
    );

    if (loading) {
        return <Spinner />;
    }

    if (!data?.getProfile) {
        return (
            <Alert color="info" className="container p-3 mb-3">
                {t('Pages:MyAccount:ProfileNotFound')}
            </Alert>
        );
    }

    const onDeleteAccount = async () => {
        const confirmed = await confirm({
            title: t('Pages:MyAccount:DeleteModal:Title'),
            message: t('Pages:MyAccount:DeleteModal:Message'),
            confirmText: t('Pages:MyAccount:DeleteModal:Confirm'),
            cancelText: t('Pages:MyAccount:DeleteModal:Cancel'),
            cancelColor: 'secondary'
        });

        if (!confirmed) {
            return;
        }

        try {
            const result = await deleteAccount();
            toast.success(t(`Api:Codes:${result.data.deleteAccount.code}`));
            removeToken();
            history.push('/');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container>
            <h1>{t('Pages:MyAccount:Title')}</h1>
            <hr />

            <div className="d-flex justify-content-between">
                <h3>{t('Pages:MyAccount:ProfileSection:Title')}</h3>
                <Button
                    to="/update-profile"
                    color="primary"
                    className="align-self-start"
                    tag={Link}
                >
                    {t('Pages:MyAccount:ProfileSection:UpdateButton')}
                </Button>
            </div>
            <hr />

            <p>
                <span className="text-muted">
                    {t('Pages:MyAccount:ProfileSection:EmailAddress')}
                </span>
                <br />
                {data.getProfile.emailAddress}
            </p>

            <p>
                <span className="text-muted">
                    {t('Pages:MyAccount:ProfileSection:Password')}
                </span>
                <br />
                ********
                <br />
                <Link to="/change-password">
                    {t('Pages:MyAccount:ProfileSection:ChangePasswordLink')}
                </Link>
            </p>

            <p>
                <span className="text-muted">
                    {t('Pages:MyAccount:ProfileSection:Name')}
                </span>
                <br />
                {data.getProfile.firstName} {data.getProfile.lastName}
            </p>

            <p>
                <span className="text-muted">
                    {t('Pages:MyAccount:ProfileSection:DateOfBirth')}
                </span>
                <br />
                {new Date(data.getProfile.dateOfBirth).toLocaleDateString()}
            </p>

            <h3>{t('Pages:MyAccount:SettingsSection:Title')}</h3>
            <hr />
            <p>{t('Pages:MyAccount:SettingsSection:DeletePrompt')}</p>
            <p>
                <Button
                    color="danger"
                    loading={isDeleting}
                    onClick={onDeleteAccount}
                >
                    {t('Pages:MyAccount:SettingsSection:DeleteButton')}
                </Button>
            </p>
        </Container>
    );
};
