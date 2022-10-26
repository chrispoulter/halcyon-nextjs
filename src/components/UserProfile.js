import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { selectCurrentUser, removeToken } from '../redux';
import { HasPermission } from './HasPermission';

export const UserProfile = () => {
    const router = useRouter();

    const dispatch = useDispatch();

    const currentUser = useSelector(selectCurrentUser);

    const logout = () => {
        dispatch(removeToken());
        router.push('/');
    };

    return (
        <Nav>
            <HasPermission
                fallback={
                    <>
                        <Link href="/login" legacyBehavior passHref>
                            <Nav.Link>Login</Nav.Link>
                        </Link>
                        <Link href="/register" legacyBehavior passHref>
                            <Nav.Link>Register</Nav.Link>
                        </Link>
                    </>
                }
            >
                <NavDropdown
                    id="collasible-nav-authenticated"
                    title={`${currentUser?.given_name} ${currentUser?.family_name} `}
                >
                    <Link href="/my-account" legacyBehavior passHref>
                        <NavDropdown.Item>My Account</NavDropdown.Item>
                    </Link>
                    <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                </NavDropdown>
            </HasPermission>
        </Nav>
    );
};
