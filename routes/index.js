import passport from 'passport';

import Router from '../extensions/router';

import UsersController from './users-controller';
import ArticlesController from './articles-controller';

function isBearerAuthenticate(req, res, next) {
    passport.authenticate('bearer', { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.status(401).json({
                status: false,
                message: 'Incorrect token.'
            });
        }

        if (!req.isAuthenticated()) {
            return res.status(403).json({
                status: false,
                message: 'Not authenticated.'
            });
        }

        next();
    })(req, res, next);
}

export default class Index extends Router {
    get root() {
        return '/';
    }

    get routes() {
        return [
            ['use', UsersController],
            ['use', ArticlesController],

            ['get', '/', this.actionIndex],
            ['post', '/login', this.actionLogin],
            ['get', '/logout', this.actionLogout],
            ['get', '/secure', isBearerAuthenticate, this.actionSecure],
        ];
    }

    actionIndex(req, res) {
        req.session.random = req.session.random || Math.random();

        res.json({
            random: req.session.random,
            user: req.user,
            isAuthenticated: req.isAuthenticated(),
            message: 'Index'
        });
    }

    actionLogin(req, res, next) {
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                return next(err);
            }

            if (!user) {
                return res.json({
                    status: false,
                    message: info.message
                });
            }

            req.login(user, (err) => {
                if (err) {
                    return next(err);
                }

                res.json({
                    status: true,
                    user: req.user,
                    isAuthenticated: req.isAuthenticated(),
                    message: 'Login',
                    token: user.token
                });
            });
        })(req, res, next);
    }

    actionLogout(req, res) {
        if (!req.isAuthenticated()) {
            return res.json({
                status: false,
                message: 'You are not logged in.'
            });
        }

        req.logout();

        res.json({
            status: true,
            user: req.user,
            isAuthenticated: req.isAuthenticated(),
            message: 'Logout'
        });
    }

    actionSecure(req, res) {
        res.json({
            message: 'Secure'
        });
    }
}
