import { ApolloServer } from 'apollo-server-lambda';
import { dataSources } from './dataSources';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { context } from './context';
import { wrapper, plugin } from './utils/logger';

const server = new ApolloServer({
    dataSources,
    typeDefs,
    resolvers,
    context,
    plugins: [plugin],
    introspection: true,
    playground: true
});

export const handler = wrapper(
    server.createHandler({
        cors: {
            origin: '*',
            credentials: true
        }
    })
);
