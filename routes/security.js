import Router from '../extensions/router';

import isBearerAuthenticate from '../middlewares/is-bearer-authenticate';

import User from '../models/user';

export default class SecurityRouter extends Router {
    get path() {
        return '/security';
    }

    get routes() {
        return [
            ['post', '/login', this.actionLogin],
            ['post', '/signup', this.actionSignup],
            ['get', '/logout', isBearerAuthenticate, this.actionLogout]
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

            user.token = user.generateToken();
            user = await user.save();

            res.json({
                user: user,
                status: true,
                message: 'Login success'
            });
        }
        catch (err) {
            res.json({
                error: err,
                status: false,
                message: 'Error Login'
            });
        }
    }

    async actionSignup(req, res) {
        try {
            const user = await new User({
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
                phone: req.body.phone
            }).save();

            res.json({
                user,
                status: true,
                message: 'Create new user'
            });
        }
        catch (err) {
            res.json({
                error: err.errors || err,
                status: false,
                message: 'Error Create new user'
            });
        }
    }

    async actionLogout(req, res) {
        req.user.token = '';

        await req.user.save();

        req.logout();

        res.json({
            status: true,
            message: 'Logout'
        });
    }
}
