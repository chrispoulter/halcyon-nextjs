import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container, Jumbotron, Button } from 'reactstrap';

export const NotFoundPage = () => {
    const { t } = useTranslation();

    return (
        <Jumbotron>
            <Container>
                <h1 className="display-3">
                    {t('UI:Pages:NotFound:Jumotron:Title')}
                </h1>
                <hr />
                <p className="lead">{t('UI:Pages:NotFound:Jumotron:Lead')}</p>
                <p className="text-right">
                    <Button to="/" color="primary" size="lg" tag={Link}>
                        {t('UI:Pages:NotFound:Jumotron:HomeButton')}
                    </Button>
                </p>
            </Container>
        </Jumbotron>
    );
};
