const mongoose = require('mongoose');
const logger = require('./logger');
const config = require('./config');

mongoose.Promise = global.Promise;

let cachedDb;

module.exports.openConnection = async () => {
    if (cachedDb) {
        logger.log('Using Cached Connection...');
        return Promise.resolve(cachedDb);
    }

    logger.log('Opening New Connection...');

    const db = await mongoose.connect(config.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    });

    cachedDb = db;
    return cachedDb;
};
