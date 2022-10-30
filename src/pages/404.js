import React from 'react';
import Link from 'next/link';
import { Hero, Button, Meta } from '@/components';

const NotFoundPage = () => (
    <>
        <Meta title="Page Not Found" />

        <Hero>
            <h1 className="display-3">Page Not Found</h1>
            <hr />
            <p className="lead">
                Sorry, the Page you were looking for could not be found.
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

export default NotFoundPage;
