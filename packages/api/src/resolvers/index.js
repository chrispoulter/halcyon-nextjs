const { GraphQLDateTime } = require('graphql-iso-date');
const accountResolvers = require('./accountResolvers');
const manageResolvers = require('./manageResolvers');
const seedResolvers = require('./seedResolvers');
const tokenResolvers = require('./tokenResolvers');
const userResolvers = require('./userResolvers');

const customScalarResolver = {
    DateTime: GraphQLDateTime
};

module.exports = [
    customScalarResolver,
    userResolvers,
    accountResolvers,
    manageResolvers,
    tokenResolvers,
    seedResolvers
];
