import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container, Jumbotron, Row, Col, Button } from 'reactstrap';

export const HomePage = () => {
    const { t } = useTranslation();

    return (
        <>
            <Jumbotron>
                <Container>
                    <h1 className="display-3">
                        {t('ui:Pages:Home:Jumbotron:Title')}
                    </h1>
                    <hr />
                    <p className="lead">{t('ui:Pages:Home:Jumbotron:Lead')}</p>
                    <p className="text-right">
                        <Button
                            to="/register"
                            color="primary"
                            size="lg"
                            tag={Link}
                        >
                            {t('ui:Pages:Home:Jumbotron:RegisterButton')}
                        </Button>
                    </p>
                </Container>
            </Jumbotron>

            <Container>
                <Row className="justify-content-md-center">
                    <Col lg={4}>
                        <h2>{t('ui:Pages:Home:Panel:Title')}</h2>
                        <hr />
                        <p>{t('ui:Pages:Home:Panel:Text')}</p>
                    </Col>
                    <Col lg={4}>
                        <h2>{t('ui:Pages:Home:Panel:Title')}</h2>
                        <hr />
                        <p>{t('ui:Pages:Home:Panel:Text')}</p>
                    </Col>
                    <Col lg={4}>
                        <h2>{t('ui:Pages:Home:Panel:Title')}</h2>
                        <hr />
                        <p>{t('ui:Pages:Home:Panel:Text')}</p>
                    </Col>
                </Row>
            </Container>
        </>
    );
};
