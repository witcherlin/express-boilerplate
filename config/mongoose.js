import mongoose from 'mongoose';
import session from 'express-session';
import connectMongo from 'connect-mongo';

import config from './index';

export const MongoStore = connectMongo(session);

mongoose.connect(config.mongoose.uri, {
    useMongoClient: true
});

mongoose.connection.on('error', (err) => {
    throw err;
});

mongoose.Promise = Promise;

export default mongoose;
