import { linkSchema } from './linkSchema';
import { accountSchema } from './accountSchema';
import { manageSchema } from './manageSchema';
import { seedSchema } from './seedSchema';
import { tokenSchema } from './tokenSchema';
import { userSchema } from './userSchema';

export const typeDefs = [
    linkSchema,
    userSchema,
    accountSchema,
    manageSchema,
    seedSchema,
    tokenSchema
];
