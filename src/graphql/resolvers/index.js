const accountResolvers = require('./accountResolvers');
const manageResolvers = require('./manageResolvers');
const seedResolvers = require('./seedResolvers');
const tokenResolvers = require('./tokenResolvers');
const userResolvers = require('./userResolvers');

module.exports = [
    userResolvers,
    accountResolvers,
    manageResolvers,
    tokenResolvers,
    seedResolvers
];
