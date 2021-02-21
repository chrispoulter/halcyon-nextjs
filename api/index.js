import { ApolloServer } from 'apollo-server-lambda';
import { dataSources } from './dataSources';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { context } from './context';
import { initializeLogger, loggerPlugin } from './utils/logger';

const server = new ApolloServer({
    dataSources,
    typeDefs,
    resolvers,
    context,
    plugins: [loggerPlugin],
    introspection: true,
    playground: true
});

export const handler = initializeLogger(
    server.createHandler({
        cors: {
            origin: '*',
            credentials: true
        }
    })
);
