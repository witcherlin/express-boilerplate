import uniqid from 'uniqid';

import Router from '../extensions/router';

import User from '../models/user';

export default class SecurityRouter extends Router {
    get path() {
        return '/security';
    }

    get routes() {
        return [
            ['post', '/login', this.actionLogin],
            ['post', '/signup', this.actionSignup],
            ['get', '/logout', this.actionLogout]
        ];
    }

    async actionLogin(req, res) {
        try {
            let user = await User.findOne({
                email: req.body.email
            });

            if (!user) {
                return res.json({
                    status: false,
                    message: 'Incorrect email.'
                });
            }

            if (!user.comparePassword(req.body.password)) {
                return res.json({
                    status: false,
                    message: 'Incorrect password.'
                });
            }

            user.token = uniqid();
            user = await user.save();

            req.login(user, (err) => {
                if (err) {
                    throw err;
                }

                res.json({
                    status: true,
                    user: user,
                    message: 'Login'
                });
            });
        }
        catch (err) {
            res.json({
                status: false,
                error: err,
                message: 'Error Login'
            });
        }
    }

    async actionSignup(req, res) {
        res.json({
            status: true,
            user: null,
            message: 'Sign up'
        });
    }

    async actionLogout(req, res) {
        if (!req.isAuthenticated()) {
            return res.json({
                status: false,
                message: 'You are not logged in.'
            });
        }

        req.user.token = '';
        await req.user.save();

        req.logout();

        res.json({
            status: true,
            message: 'Logout'
        });
    }
}
