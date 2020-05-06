const { Client, query: q } = require('faunadb');
const { base64EncodeObj, base64DecodeObj } = require('../utils/encode');
const config = require('../utils/config');

const client = new Client({ secret: config.FAUNADB_SECRET });

module.exports.getUserById = async id => {
    try {
        const result = await client.query(
            q.Get(q.Ref(q.Collection('users'), id))
        );

        return { ...result.data, id: result.ref.id };
    } catch (error) {
        if (error.name === 'NotFound') {
            return undefined;
        }

        throw error;
    }
};

module.exports.getUserByEmailAddress = async emailAddress => {
    try {
        const result = await client.query(
            q.Get(q.Match(q.Index('users_by_email_address'), emailAddress))
        );

        return mapUser(result);
    } catch (error) {
        if (error.name === 'NotFound') {
            return undefined;
        }

        throw error;
    }
};

module.exports.createUser = async user => {
    const result = await client.query(
        q.Create(q.Collection('users'), { data: user })
    );

    return mapUser(result);
};

module.exports.updateUser = async user => {
    const { id, ...data } = user;

    const result = await client.query(
        q.Replace(q.Ref(q.Collection('users'), id), { data })
    );

    return mapUser(result);
};

module.exports.removeUser = async ({ id }) => {
    const result = await client.query(
        q.Delete(q.Ref(q.Collection('users'), id))
    );

    return mapUser(result);
};

module.exports.searchUsers = async ({ size, search, sort, cursor }) => {
    const { name, values } = getIndex(sort);
    const { before, after } = parseCursor(cursor);

    const result = await client.query(
        q.Map(
            q.Paginate(
                q.Filter(
                    q.Match(name),
                    q.Lambda(
                        values,
                        q.ContainsStr(
                            q.Casefold(q.Var('emailAddress')),
                            q.Casefold(search)
                        )
                    )
                ),
                {
                    size,
                    before,
                    after
                }
            ),
            q.Lambda(values, q.Get(q.Var('ref')))
        )
    );

    return {
        items: result.data.map(mapUser),
        ...generateCursors(result)
    };
};

const getIndex = sort => {
    switch (sort) {
        case 'EMAIL_ADDRESS_DESC':
            return {
                name: 'users_email_address_desc',
                values: ['emailAddress', 'firstName', 'lastName', 'ref']
            };

        case 'EMAIL_ADDRESS_ASC':
            return {
                name: 'users_email_address_asc',
                values: ['emailAddress', 'firstName', 'lastName', 'ref']
            };

        case 'NAME_DESC':
            return {
                name: 'users_name_desc',
                values: ['firstName', 'lastName', 'emailAddress', 'ref']
            };

        default:
            return {
                name: 'users_name_asc',
                values: ['firstName', 'lastName', 'emailAddress', 'ref']
            };
    }
};

const getItems = arr => {
    if (!arr) {
        return undefined;
    }

    return arr.map(item => {
        if (!item.collection) {
            return item;
        }

        return { collection: item.collection.id, id: item.id };
    });
};

const generateCursors = result => ({
    before:
        result.before && base64EncodeObj({ before: getItems(result.before) }),
    after: result.after && base64EncodeObj({ after: getItems(result.after) })
});

const parseItems = arr => {
    if (!arr) {
        return undefined;
    }

    return arr.map(item => {
        if (!item.collection) {
            return item;
        }

        return q.Ref(q.Collection(item.collection), item.id);
    });
};

const parseCursor = str => {
    const decoded = base64DecodeObj(str);
    if (!decoded) {
        return {
            before: undefined,
            after: undefined
        };
    }

    return {
        before: parseItems(decoded.before),
        after: parseItems(decoded.after)
    };
};

const mapUser = user => ({ id: user.ref.id, ...user.data });
