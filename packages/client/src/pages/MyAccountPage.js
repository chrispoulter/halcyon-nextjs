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
    const { t, i18n } = useTranslation();

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
                {t('pages:myAccount.profileNotFound')}
            </Alert>
        );
    }

    const onDeleteAccount = async () => {
        const confirmed = await confirm({
            title: t('pages:myAccount.deleteModal.title'),
            message: t('pages:myAccount.deleteModal.message'),
            confirmText: t('pages:myAccount.deleteModal.confirm'),
            cancelText: t('pages:myAccount.deleteModal.cancel'),
            cancelColor: 'secondary'
        });

        if (!confirmed) {
            return;
        }

        try {
            const result = await deleteAccount();
            toast.success(t(`api:codes.${result.data.deleteAccount.code}`));
            removeToken();
            history.push('/');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container>
            <h1>{t('pages:myAccount.title')}</h1>
            <hr />

            <div className="d-flex justify-content-between">
                <h3>{t('pages:myAccount.profileSection.title')}</h3>
                <Button
                    to="/update-profile"
                    color="primary"
                    className="align-self-start"
                    tag={Link}
                >
                    {t('pages:myAccount.profileSection.updateButton')}
                </Button>
            </div>
            <hr />

            <p>
                <span className="text-muted">
                    {t('pages:myAccount.profileSection.emailAddress')}
                </span>
                <br />
                {data.getProfile.emailAddress}
            </p>

            <p>
                <span className="text-muted">
                    {t('pages:myAccount.profileSection.password')}
                </span>
                <br />
                ********
                <br />
                <Link to="/change-password">
                    {t('pages:myAccount.profileSection.changePasswordLink')}
                </Link>
            </p>

            <p>
                <span className="text-muted">
                    {t('pages:myAccount.profileSection.name')}
                </span>
                <br />
                {data.getProfile.firstName} {data.getProfile.lastName}
            </p>

            <p>
                <span className="text-muted">
                    {t('pages:myAccount.profileSection.dateOfBirth')}
                </span>
                <br />
                {new Date(data.getProfile.dateOfBirth).toLocaleDateString(
                    i18n.language
                )}
            </p>

            <h3>{t('pages:myAccount.settingsSection.title')}</h3>
            <hr />
            <p>{t('pages:myAccount.settingsSection.deletePrompt')}</p>
            <p>
                <Button
                    color="danger"
                    loading={isDeleting}
                    onClick={onDeleteAccount}
                >
                    {t('pages:myAccount.settingsSection.deleteButton')}
                </Button>
            </p>
        </Container>
    );
};
