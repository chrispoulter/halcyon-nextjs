const { gql } = require('apollo-server');

const linkSchema = require('./linkSchema');
const accountSchema = require('./accountSchema');
const manageSchema = require('./manageSchema');
const seedSchema = require('./seedSchema');
const tokenSchema = require('./tokenSchema');
const userSchema = require('./userSchema');

module.exports = [
    linkSchema,
    userSchema,
    accountSchema,
    manageSchema,
    seedSchema,
    tokenSchema
];
