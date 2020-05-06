const bcrypt = require('bcryptjs');

module.exports.generateHash = str => bcrypt.hash(str, 10);

module.exports.verifyHash = (str, hash) => bcrypt.compare(str, hash);
