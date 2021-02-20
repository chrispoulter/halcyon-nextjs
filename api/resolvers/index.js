import { GraphQLDateTime } from 'graphql-iso-date';
import { accountResolvers } from './accountResolvers';
import { manageResolvers } from './manageResolvers';
import { tokenResolvers } from './tokenResolvers';
import { userResolvers } from './userResolvers';

const customScalarResolver = {
    DateTime: GraphQLDateTime
};

export const resolvers = [
    customScalarResolver,
    userResolvers,
    accountResolvers,
    manageResolvers,
    tokenResolvers
];
