const mongoose = require('mongoose');
const config = require('./config');

mongoose.Promise = global.Promise;

let cachedDb;

module.exports.openConnection = async () => {
    if (cachedDb) {
        console.log('Using Cached Connection...');
        return Promise.resolve(cachedDb);
    }

    console.log('Opening New Connection...');

    const db = await mongoose.connect(config.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    });

    cachedDb = db;
    return cachedDb;
};
