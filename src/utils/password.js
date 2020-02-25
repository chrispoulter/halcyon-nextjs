const bcrypt = require('bcryptjs');

module.exports.hashPassword = password => bcrypt.hash(password, 10);

module.exports.verifyPassword = (password, hashedString) =>
    bcrypt.compare(password, hashedString);
