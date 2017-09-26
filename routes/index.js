import Router from '../extensions/router';

import isBearerAuthenticate from '../middlewares/is-bearer-authenticate';

import UsersRouter from './users';
import ArticlesRouter from './articles';
import SecurityRouter from './security';

export default class Index extends Router {
    get path() {
        return '/';
    }

    get routes() {
        return [
            ['use', UsersRouter],
            ['use', ArticlesRouter],
            ['use', SecurityRouter],

            ['get', '/', this.actionIndex],
            ['get', '/security', isBearerAuthenticate, this.actionSecure],
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

    actionSecure(req, res) {
        res.json({
            message: 'Security'
        });
    }
}
