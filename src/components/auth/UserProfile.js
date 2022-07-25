import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useAuth } from '../../contexts';
import { HasPermission } from './HasPermission';

export const UserProfile = () => {
    const router = useRouter();

    const { currentUser, removeToken } = useAuth();

    const logout = () => {
        removeToken();
        router.push('/');
    };

    return (
        <Nav>
            <HasPermission
                fallback={
                    <>
                        <Link href="/login" passHref>
                            <Nav.Link eventKey="login">Login</Nav.Link>
                        </Link>
                        <Link href="/register" passHref>
                            <Nav.Link eventKey="register">Register</Nav.Link>
                        </Link>
                    </>
                }
            >
                <NavDropdown
                    id="collasible-nav-authenticated"
                    title={`${currentUser?.given_name} ${currentUser?.family_name} `}
                >
                    <Link href="/my-account" passHref>
                        <NavDropdown.Item eventKey="my-account">
                            My Account
                        </NavDropdown.Item>
                    </Link>
                    <NavDropdown.Item eventKey="logout" onClick={logout}>
                        Logout
                    </NavDropdown.Item>
                </NavDropdown>
            </HasPermission>
        </Nav>
    );
};
