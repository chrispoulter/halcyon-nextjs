const UserModel = require('./userModel');

module.exports.getUserById = id => UserModel.findById(id);

module.exports.getUserByEmailAddress = emailAddress =>
    UserModel.findOne({
        emailAddress
    });

module.exports.createUser = user => new UserModel(user).save();

module.exports.updateUser = user => user.save();

module.exports.removeUser = user => user.remove();

module.exports.searchUsers = async (page, size, search, sort) => {
    const searchExpression = getSearchExpression(search);
    const sortExpression = getSortExpression(sort);

    const totalCount = await UserModel.find(searchExpression).countDocuments();

    const users = await UserModel.find(searchExpression)
        .sort(sortExpression)
        .limit(size)
        .skip(size * (page - 1))
        .exec();

    const totalPages = Math.ceil(totalCount / size);

    return {
        items: users,
        page,
        size,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
    };
};

const getSearchExpression = search => {
    if (!search) {
        return undefined;
    }

    return { $text: { $search: search } };
};

const getSortExpression = sort => {
    const sortExpression = [];

    switch (sort) {
        case 'EMAIL_ADDRESS_DESC':
            sortExpression.push(['emailAddress', 'descending']);
            break;

        case 'EMAIL_ADDRESS':
            sortExpression.push(['emailAddress', 'ascending']);
            break;

        case 'DISPLAY_NAME_DESC':
            sortExpression.push(['firstName', 'descending']);
            sortExpression.push(['lastName', 'descending']);
            break;

        default:
            sortExpression.push(['firstName', 'ascending']);
            sortExpression.push(['lastName', 'ascending']);
            break;
    }

    return sortExpression;
};
