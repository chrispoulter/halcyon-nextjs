import React from 'react';
import { Router } from 'next/router';
import Link from 'next/link';
import Button from 'react-bootstrap/Button';
import { Hero } from './Hero';
import { Meta } from './Meta';

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);

        this.state = { hasError: false };

        this.handleRouteChange = this.handleRouteChange.bind(this);
    }

    handleRouteChange() {
        this.setState({ hasError: false });
    }

    componentDidMount() {
        Router.events.on('routeChangeComplete', this.handleRouteChange);
    }

    componentWillUnmount() {
        Router.events.off('routeChangeComplete', this.handleRouteChange);
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch() {
        // console.error(error, errorInfo);
    }

    render() {
        if (!this.state.hasError) {
            return this.props.children;
        }

        return (
            <>
                <Meta title="Error" />

                <Hero>
                    <h1 className="display-3">Error</h1>
                    <hr />
                    <p className="lead">
                        Sorry, something went wrong. Please try again later.
                    </p>
                    <p className="text-end">
                        <Link href="/" passHref>
                            <Button variant="primary" size="lg">
                                Home
                            </Button>
                        </Link>
                    </p>
                </Hero>
            </>
        );
    }
}
