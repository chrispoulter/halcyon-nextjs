import React, { useContext } from 'react';
import { ApolloProvider as BaseApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import { toast } from 'react-toastify';
import { AuthContext } from './AuthProvider';
import { captureGraphQLError } from '../../utils/logger';
import { config } from '../../utils/config';

export const ApolloProvider = ({ children }) => {
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
        onError: error => {
            if (error.graphQLErrors) {
                for (const graphQLError of error.graphQLErrors) {
                    switch (graphQLError.extensions?.code) {
                        case 'UNAUTHENTICATED':
                            removeToken();
                            break;

                        case 'FORBIDDEN':
                            toast.warn(graphQLError.message);
                            break;

                        default:
                            toast.error(
                                graphQLError.message ||
                                    'An unknown error has occurred whilst communicating with the server.'
                            );
                            break;
                    }
                }
            } else if (error.networkError) {
                toast.error(
                    'An unknown error has occurred whilst communicating with the server.'
                );
            }

            captureGraphQLError(error);
        }
    });

    return <BaseApolloProvider client={client}>{children}</BaseApolloProvider>;
};
