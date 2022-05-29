import React from 'react';
import Link from 'next/link';
import { Hero, Button, Meta } from '../components';

const AccessDeniedPage = () => (
    <>
        <Meta title="Access Denied" />

        <Hero>
            <h1 className="display-3">Access Denied</h1>
            <hr />
            <p className="lead">
                Sorry, you do not have access to this resource.
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

export default AccessDeniedPage;
