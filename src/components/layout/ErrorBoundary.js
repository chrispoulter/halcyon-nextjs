import React from 'react';
import Link from 'next/link';
import Button from 'react-bootstrap/Button';
import { Hero } from '../common';
import { Meta } from './Meta';

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
