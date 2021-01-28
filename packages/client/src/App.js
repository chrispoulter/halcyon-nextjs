import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ToastContainer, Slide } from 'react-toastify';
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
    const { t } = useTranslation();

    return (
        <AuthProvider>
            <ApolloProvider>
                <BrowserRouter>
                    <Header />
                    <ErrorBoundary>
                        <Switch>
                            <PublicRoute path="/" component={HomePage} exact />
                            <PublicRoute
                                title={t('pages:register.meta.title')}
                                path="/register"
                                component={RegisterPage}
                                exact
                            />
                            <PublicRoute
                                title={t('pages:login.meta.title')}
                                path="/login"
                                component={LoginPage}
                                exact
                            />
                            <PublicRoute
                                title={t('pages:forgotPassword.meta.title')}
                                path="/forgot-password"
                                component={ForgotPasswordPage}
                                exact
                            />
                            <PublicRoute
                                title={t('pages:resetPassword.meta.title')}
                                path="/reset-password/:token"
                                component={ResetPasswordPage}
                                exact
                            />
                            <PrivateRoute
                                title={t('pages:myAccount.meta.title')}
                                path="/my-account"
                                component={MyAccountPage}
                                exact
                            />
                            <PrivateRoute
                                title={t('pages:updateProfile.meta.title')}
                                path="/update-profile"
                                component={UpdateProfilePage}
                                exact
                            />
                            <PrivateRoute
                                title={t('pages:changePassword.meta.title')}
                                path="/change-password"
                                component={ChangePasswordPage}
                                exact
                            />
                            <PrivateRoute
                                title={t('pages:user.meta.title')}
                                path="/user"
                                requiredRoles={IS_USER_ADMINISTRATOR}
                                component={UserPage}
                                exact
                            />
                            <PrivateRoute
                                title={t('pages:createUser.meta.title')}
                                path="/user/create"
                                requiredRoles={IS_USER_ADMINISTRATOR}
                                component={CreateUserPage}
                                exact
                            />
                            <PrivateRoute
                                title={t('pages:updateUser.meta.title')}
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
