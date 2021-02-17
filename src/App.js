import React, { Suspense } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { ToastContainer, Slide } from 'react-toastify';
import { ErrorBoundary } from '@sentry/react';
import {
    AuthProvider,
    ApolloProvider,
    Header,
    Footer,
    PrivateRoute,
    Spinner,
    Meta
} from './components';
import {
    HomePage,
    NotFoundPage,
    ErrorPage,
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

export const App = () => (
    <Suspense fallback={<Spinner />}>
        <BrowserRouter>
            <AuthProvider>
                <ApolloProvider>
                    <Meta />
                    <Header />
                    <ErrorBoundary fallback={ErrorPage}>
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
                                meta="pages.updateUser.meta"
                                path="/user/:id"
                                requiredRoles={IS_USER_ADMINISTRATOR}
                                component={UpdateUserPage}
                                exact
                            />
                            <Route component={NotFoundPage} />
                        </Switch>
                    </ErrorBoundary>
                    <Footer />
                    <ToastContainer
                        position="bottom-right"
                        hideProgressBar
                        draggable={false}
                        transition={Slide}
                    />
                </ApolloProvider>
            </AuthProvider>
        </BrowserRouter>
    </Suspense>
);
