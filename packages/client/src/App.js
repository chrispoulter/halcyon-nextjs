import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ToastContainer, Slide } from 'react-toastify';
import { Helmet } from 'react-helmet';
import {
    AuthProvider,
    ApolloProvider,
    Header,
    Footer,
    PrivateRoute,
    ErrorBoundary
} from './components';
import {
    HomePage,
    NotFoundPage,
    LoginPage,
    RegisterPage,
    ForgotPasswordPage,
    ResetPasswordPage,
    MyAccountPage,
    UpdateProfilePage,
    ChangePasswordPage,
    UserPage,
    CreateUserPage,
    UpdateUserPage
} from './pages';
import { IS_USER_ADMINISTRATOR } from './utils/auth';

export const App = () => {
    const { t, i18n } = useTranslation();

    return (
        <AuthProvider>
            <ApolloProvider>
                <Helmet
                    defaultTitle={t('meta:title')}
                    titleTemplate={t('meta:template')}
                >
                    <html lang={i18n.language} />
                    <meta name="description" content={t('meta:description')} />
                    <meta name="keywords" content={t('meta:keywords')} />
                </Helmet>

                <BrowserRouter>
                    <Header />
                    <ErrorBoundary>
                        <Switch>
                            <Route path="/" component={HomePage} exact />
                            <Route
                                path="/register"
                                component={RegisterPage}
                                exact
                            />
                            <Route path="/login" component={LoginPage} exact />
                            <Route
                                path="/forgot-password"
                                component={ForgotPasswordPage}
                                exact
                            />
                            <Route
                                path="/reset-password/:token"
                                component={ResetPasswordPage}
                                exact
                            />
                            <PrivateRoute
                                path="/my-account"
                                component={MyAccountPage}
                                exact
                            />
                            <PrivateRoute
                                path="/update-profile"
                                component={UpdateProfilePage}
                                exact
                            />
                            <PrivateRoute
                                path="/change-password"
                                component={ChangePasswordPage}
                                exact
                            />
                            <PrivateRoute
                                path="/user"
                                requiredRoles={IS_USER_ADMINISTRATOR}
                                component={UserPage}
                                exact
                            />
                            <PrivateRoute
                                path="/user/create"
                                requiredRoles={IS_USER_ADMINISTRATOR}
                                component={CreateUserPage}
                                exact
                            />
                            <PrivateRoute
                                meta="pages:updateUser.meta"
                                path="/user/:id"
                                requiredRoles={IS_USER_ADMINISTRATOR}
                                component={UpdateUserPage}
                                exact
                            />
                            <Route component={NotFoundPage} />
                        </Switch>
                    </ErrorBoundary>
                    <Footer />
                </BrowserRouter>

                <ToastContainer
                    position="bottom-right"
                    hideProgressBar
                    draggable={false}
                    transition={Slide}
                />
            </ApolloProvider>
        </AuthProvider>
    );
};
