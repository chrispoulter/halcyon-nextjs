import React, { useState, useEffect, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Container
} from 'reactstrap';
import { AuthContext } from '../providers/AuthProvider';
import { isAuthorized, IS_USER_ADMINISTRATOR } from '../../utils/auth';

export const Header = () => {
    const { t } = useTranslation();

    const history = useHistory();

    const { currentUser, removeToken } = useContext(AuthContext);

    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const listen = history.listen(() => setIsOpen(false));
        return () => listen();
    }, [history]);

    const isAuthenticated = isAuthorized(currentUser);
    const isUserAdmin = isAuthorized(currentUser, IS_USER_ADMINISTRATOR);

    const logout = () => {
        removeToken();
        history.push('/');
    };

    const toggle = () => setIsOpen(!isOpen);

    return (
        <header>
            <Navbar color="dark" dark expand="md" fixed="top">
                <Container>
                    <NavbarBrand to="/" tag={Link}>
                        {t('components:header.brand')}
                    </NavbarBrand>
                    <NavbarToggler onClick={toggle} />
                    <Collapse isOpen={isOpen} navbar>
                        <Nav navbar>
                            {isUserAdmin && (
                                <NavItem>
                                    <NavLink to="/user" tag={Link}>
                                        {t('components:header.nav.users')}
                                    </NavLink>
                                </NavItem>
                            )}
                        </Nav>

                        <Nav navbar className="ml-auto">
                            {isAuthenticated ? (
                                <UncontrolledDropdown nav inNavbar>
                                    <DropdownToggle nav caret>
                                        {currentUser.given_name}{' '}
                                        {currentUser.family_name}{' '}
                                    </DropdownToggle>
                                    <DropdownMenu right>
                                        <DropdownItem
                                            to="/my-account"
                                            tag={Link}
                                        >
                                            {t(
                                                'components:header.nav.myAccount'
                                            )}
                                        </DropdownItem>
                                        <DropdownItem onClick={logout}>
                                            {t('components:header.nav.logout')}
                                        </DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            ) : (
                                <>
                                    <NavItem>
                                        <NavLink to="/login" tag={Link}>
                                            {t('components:header.nav.login')}
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink to="/register" tag={Link}>
                                            {t(
                                                'components:header.nav.register'
                                            )}
                                        </NavLink>
                                    </NavItem>
                                </>
                            )}
                        </Nav>
                    </Collapse>
                </Container>
            </Navbar>
        </header>
    );
};
