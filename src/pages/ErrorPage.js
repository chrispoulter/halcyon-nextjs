import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { Container, Jumbotron, Button } from 'reactstrap';

export const ErrorPage = () => {
    const { t } = useTranslation();

    return (
        <>
            <Helmet>
                <title>{t('pages.error.meta.title')}</title>
            </Helmet>

            <Jumbotron>
                <Container>
                    <h1 className="display-3">
                        {t('pages.error.jumbotron.title')}
                    </h1>
                    <hr />
                    <p className="lead">{t('pages.error.jumbotron.lead')}</p>
                    <p className="text-right">
                        <Button to="/" color="primary" size="lg" tag={Link}>
                            {t('pages.error.jumbotron.homeButton')}
                        </Button>
                    </p>
                </Container>
            </Jumbotron>
        </>
    );
};
