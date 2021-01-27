import React, { useContext } from 'react';
import { ApolloProvider as BaseApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { AuthContext } from './AuthProvider';
import config from '../../utils/config';

export const ApolloProvider = ({ children }) => {
    const { t } = useTranslation();

    const { accessToken, removeToken } = useContext(AuthContext);

    const client = new ApolloClient({
        uri: config.GRAPHQL_URL,
        resolvers: {},
        request: operation =>
            operation.setContext({
                headers: {
                    authorization: accessToken ? `Bearer ${accessToken}` : ''
                }
            }),
        onError: ({ graphQLErrors, networkError, operation }) => {
            if (graphQLErrors) {
                for (const graphQLError of graphQLErrors || []) {
                    const { code } = graphQLError.extensions;
                    switch (code) {
                        case 'BAD_USER_INPUT':
                            toast.error(
                                t(`Codes:${code}`),
                                operation.variables
                            );
                            break;

                        case 'UNAUTHENTICATED':
                            removeToken();
                            break;

                        case 'FORBIDDEN':
                            toast.warn(t(`Codes:${code}`, operation.variables));
                            break;

                        default:
                            toast.error(
                                t(`Codes:${code}`, operation.variables) ||
                                    t(
                                        'Codes:UNKNOWN_ERROR',
                                        operation.variables
                                    )
                            );

                            break;
                    }
                }
            } else if (networkError) {
                toast.error(t('Codes:UNKNOWN_ERROR', operation.variables));
            }
        }
    });

    return <BaseApolloProvider client={client}>{children}</BaseApolloProvider>;
};
