import path from 'path';
import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import session from 'express-session';
import busboy from 'connect-busboy';

import config from './config';
import passport from './config/passport';
import mongoose, { MongoStore } from './config/mongoose';

import Index from './routes';

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));

app.use(busboy());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(session({
    secret: config.security.secret,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', new Index());

app.use((req, res, next) => {
    const err = new Error('Not Found');

    err.status = 404;

    next(err);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);

    res.render('error', {
        message: err.message,
        error: req.app.get('env') === 'development' ? err : {}
    });
});

export default app;