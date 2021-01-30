import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container } from 'reactstrap';
import * as resources from '../../resources';

const currentYear = new Date().getFullYear();

export const Footer = () => {
    const { t, i18n } = useTranslation();

    const changeLanguage = lng => {
        i18n.changeLanguage(lng);
    };

    return (
        <footer>
            <Container className="pt-3">
                <hr />
                <div className="d-flex justify-content-between">
                    <p>
                        &copy;{' '}
                        <a href="https://www.chrispoulter.com">Chris Poulter</a>{' '}
                        {currentYear}
                    </p>
                    <p>
                        {Object.keys(resources).map(lng => (
                            <button
                                key={lng}
                                type="button"
                                className="btn btn-link p-0 ml-2"
                                onClick={() => changeLanguage(lng)}
                            >
                                {t(`languages:${lng}`)}
                            </button>
                        ))}
                    </p>
                </div>
            </Container>
        </footer>
    );
};
