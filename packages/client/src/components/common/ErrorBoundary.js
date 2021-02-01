import React from 'react';
import { Link } from 'react-router-dom';
import { Trans } from 'react-i18next';
import { Container, Jumbotron, Button } from 'reactstrap';

export class ErrorBoundary extends React.Component {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error(error, errorInfo);
    }

    render() {
        if (!this.state.hasError) {
            return this.props.children;
        }

        return (
            <Jumbotron>
                <Container>
                    <h1 className="display-3">
                        <Trans>components.errorBoundary.jumbotron.title</Trans>
                    </h1>
                    <hr />
                    <p className="lead">
                        <Trans>components.errorBoundary.jumbotron.lead</Trans>
                    </p>
                    <p className="text-right">
                        <Button to="/" color="primary" size="lg" tag={Link}>
                            <Trans>
                                components.errorBoundary.jumbotron.homeButton
                            </Trans>
                        </Button>
                    </p>
                </Container>
            </Jumbotron>
        );
    }
}
