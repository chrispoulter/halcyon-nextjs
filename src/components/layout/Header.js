import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import { useOnClickOutside } from '../../hooks';
import { HasPermission, UserProfile } from '../auth';
import { USER_ADMINISTRATOR_ROLES } from '../../utils/auth';

export const Header = () => {
    const ref = useRef();

    const [expanded, setExpanded] = useState(false);

    const onClose = () => setExpanded(false);

    useOnClickOutside(ref, onClose);

    return (
        <Navbar
            ref={ref}
            expand="lg"
            bg="dark"
            variant="dark"
            className="mb-3"
            expanded={expanded}
            onToggle={setExpanded}
            onSelect={onClose}
        >
            <Container>
                <Link href="/" passHref>
                    <Navbar.Brand onClick={onClose}>Halcyon</Navbar.Brand>
                </Link>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <HasPermission requiredRoles={USER_ADMINISTRATOR_ROLES}>
                            <Link href="/user" passHref>
                                <Nav.Link eventKey="users">Users</Nav.Link>
                            </Link>
                        </HasPermission>
                    </Nav>
                    <UserProfile />
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};
