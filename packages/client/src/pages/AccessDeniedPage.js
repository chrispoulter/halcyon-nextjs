import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container, Jumbotron, Button } from 'reactstrap';

export const AccessDeniedPage = () => {
    const { t } = useTranslation();

    return (
        <Jumbotron>
            <Container>
                <h1 className="display-3">
                    {t('pages:accessDenied.jumbotron.title')}
                </h1>
                <hr />
                <p className="lead">{t('pages:accessDenied.jumbotron.lead')}</p>
                <p className="text-right">
                    <Button to="/" color="primary" size="lg" tag={Link}>
                        {t('pages:accessDenied.jumbotron.homeButton')}
                    </Button>
                </p>
            </Container>
        </Jumbotron>
    );
};
