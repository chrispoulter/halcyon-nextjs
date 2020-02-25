const accountResolvers = require('./accountResolvers');
const manageResolvers = require('./manageResolvers');
const tokenResolvers = require('./tokenResolvers');
const userResolvers = require('./userResolvers');

module.exports = [
    userResolvers,
    tokenResolvers,
    manageResolvers,
    accountResolvers
];
