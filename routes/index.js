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
            ['get', '/secure', isBearerAuthenticate, this.actionSecure],
        ];
    }

    actionIndex(req, res) {
        req.session.random = req.session.random || Math.random();

        res.json({
            random: req.session.random,
            status: true,
            message: 'Index'
        });
    }

    async actionSecure(req, res) {
        try {
            const info = await req.mailer.sendMail({
                from: '"Testtest" <testing@kirinami.com>',
                to: '"Plaintext" <witcherlin@gmail.com>',
                subject: 'Message title',
                html: '<p>HTML version of the message</p>',
                attachments:  {
                    filename: 'license.txt',
                    path: 'https://raw.github.com/nodemailer/nodemailer/master/LICENSE'
                }
            });

            res.json({
                isAuthenticated: req.isAuthenticated(),
                user: req.user,
                mailer: info,
                status: true,
                message: 'Secure'
            });
        }
        catch (err) {
            console.log(err);

            res.json({
                error: err,
                status: false,
                message: 'Secure error'
            });
        }
    }
}
