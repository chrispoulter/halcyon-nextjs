import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ToastContainer, Slide } from 'react-toastify';
import { Helmet } from 'react-helmet';
import {
    AuthProvider,
    ApolloProvider,
    Header,
    Footer,
    PublicRoute,
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
                            <PublicRoute path="/" component={HomePage} exact />
                            <PublicRoute
                                meta="pages:register.meta"
                                path="/register"
                                component={RegisterPage}
                                exact
                            />
                            <PublicRoute
                                meta="pages:login.meta"
                                path="/login"
                                component={LoginPage}
                                exact
                            />
                            <PublicRoute
                                meta="pages:forgotPassword.meta"
                                path="/forgot-password"
                                component={ForgotPasswordPage}
                                exact
                            />
                            <PublicRoute
                                meta="pages:resetPassword.meta"
                                path="/reset-password/:token"
                                component={ResetPasswordPage}
                                exact
                            />
                            <PrivateRoute
                                meta="pages:myAccount.meta"
                                path="/my-account"
                                component={MyAccountPage}
                                exact
                            />
                            <PrivateRoute
                                meta="pages:updateProfile.meta"
                                path="/update-profile"
                                component={UpdateProfilePage}
                                exact
                            />
                            <PrivateRoute
                                meta="pages:changePassword.meta"
                                path="/change-password"
                                component={ChangePasswordPage}
                                exact
                            />
                            <PrivateRoute
                                meta="pages:user.meta"
                                path="/user"
                                requiredRoles={IS_USER_ADMINISTRATOR}
                                component={UserPage}
                                exact
                            />
                            <PrivateRoute
                                meta="pages:createUser.meta"
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
                            <PublicRoute component={NotFoundPage} />
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
