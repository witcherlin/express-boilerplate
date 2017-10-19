import path from 'path';
import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import session from 'express-session';
import busboy from 'connect-busboy';

import config from './config';
import mailer from './config/mailer';
import passport from './config/passport';
import mongoose, { MongoStore } from './config/mongoose';

import Index from './routes';

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(morgan('dev'));

app.use(mailer());

app.use(busboy());

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

app.use(session({
    secret: config.security.secret,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    next();
});

app.use(express.static(path.join(__dirname, '/public')));

app.use(new Index().$router);

app.use((req, res, next) => {
    const err = new Error('Not Found');

    err.status = 404;

    next(err);
});

app.use((err, req, res, next) => {
    console.error(err);

    res.status(err.status || 500).json({
        message: err.message,
        status: false,
        error: req.app.get('env') === 'development' ? err.errors || err : {}
    });
});

export default app;
