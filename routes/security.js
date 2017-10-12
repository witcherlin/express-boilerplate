import uniqid from 'uniqid';

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
            ['get', '/logout', isBearerAuthenticate, this.actionLogout],
            ['post', '/reset', this.actionReset],
            ['post', '/verify/:action/:code', this.actionVerify]
        ];
    }

    async actionLogin(req, res) {
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

        switch (user.status) {
            case 'unconfirmed':
                return res.json({
                    status: false,
                    message: 'Confirm you email.'
                });
        }

        user.token = user.generateToken();
        user = await user.save();

        res.json({
            user: user,
            status: true,
            warning: user.status === 'forgotten' ? 'Active request to reset password.' : undefined,
            message: 'Login success'
        });
    }

    async actionSignup(req, res, next) {
        const { username, password, email, phone } = req.body;
        const code = uniqid();

        const user = await new User({ username, password, email, phone, code }).save();

        res.render('mailer/confirm-email', { username, code }, (err, html) => {
            if (err) {
                return next(err);
            }

            req.mailer.sendMail({
                from: `"Express Boilerplate" <testing@kirinami.com>`,
                to: `"${username}" <${email}>`,
                subject: `Welcome to "Express Boilerplate"! Please confirm your email address`,
                html
            }).then(() => {
                res.json({
                    user: user,
                    status: true,
                    message: 'Create new user'
                });
            }).catch(next);
        });
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

    async actionReset(req, res, next) {
        const { email } = req.body;

        if (!email) {
            return res.json({
                status: false,
                message: 'Empty email.'
            });
        }

        let user = await User.findOne({ email });

        user.code = uniqid();
        user.status = 'forgotten';

        user = await user.save();

        res.render('mailer/reset-password', { username: user.username, code: user.code }, (err, html) => {
            if (err) {
                return next(err);
            }

            req.mailer.sendMail({
                from: `"Express Boilerplate" <testing@kirinami.com>`,
                to: `"${user.username}" <${email}>`,
                subject: `Your "Express Boilerplate" password reset`,
                html
            }).then(() => {
                res.json({
                    status: true,
                    message: 'Confirm reset password'
                });
            }).catch(next);
        });
    }

    async actionVerify(req, res, next) {
        const { action, code } = req.params;
        const { email, password } = req.body;

        if (!email) {
            return res.json({
                status: false,
                message: 'Empty email.'
            });
        }

        switch (action) {
            case 'confirm': {
                let user = await User.findOne({ email, code, status: 'unconfirmed' });

                if (!user) {
                    return res.json({
                        status: false,
                        message: 'Expired action.'
                    });
                }

                user.code = '';
                user.status = 'active';

                await user.save();

                return res.json({
                    status: true,
                    message: 'User confirmed'
                });
            }
            case 'forgotten': {
                if (!password) {
                    return res.json({
                        status: false,
                        message: 'Empty new password.'
                    });
                }

                let user = await User.findOne({ email, code, status: 'forgotten' });

                if (!user) {
                    return res.json({
                        status: false,
                        message: 'Expired action.'
                    });
                }

                user.password = password;
                user.code = '';
                user.status = 'active';
                user.token = '';

                await user.save();

                return res.render('mailer/changed-password', { username: user.username }, (err, html) => {
                    if (err) {
                        return next(err);
                    }

                    req.mailer.sendMail({
                        from: `"Express Boilerplate" <testing@kirinami.com>`,
                        to: `"${user.username}" <${user.email}>`,
                        subject: `Your "Express Boilerplate" password has been changed`,
                        html
                    }).then(() => {
                        res.json({
                            status: true,
                            message: 'Changed password'
                        });
                    }).catch(next);
                });
            }
        }

        return res.json({
            status: false,
            message: 'Undefined verify action'
        });
    }
}
