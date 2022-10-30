import React from 'react';
import Link from 'next/link';
import { Hero, Button, Meta } from '@/components';

const ErrorPage = () => (
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

export default ErrorPage;
