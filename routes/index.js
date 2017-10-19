import { router, children, route } from '../extensions/router-decorator';

import isBearerAuthenticate from '../middlewares/is-bearer-authenticate';
import uploader from '../middlewares/uploader';

import UsersRouter from './users';
import ArticlesRouter from './articles';
import SecurityRouter from './security';

@router('/')
@children(
    UsersRouter,
    ArticlesRouter,
    SecurityRouter
)
export default class Index {
    @route('get', '/')
    actionIndex(req, res) {
        req.session.random = req.session.random || Math.random();

        res.json({
            random: req.session.random,
            status: true,
            message: 'Index'
        });
    }

    @route('get', '/check')
    actionCheck(req, res) {
        res.render('check', {
            title: 'Success'
        });
    }

    @route('get', '/secure', isBearerAuthenticate)
    async actionSecure(req, res) {
        const info = await req.mailer.sendMail({
            from: '"Testtest" <testing@kirinami.com>',
            to: '"Plaintext" <witcherlin@gmail.com>',
            subject: 'Message title',
            html: '<p>HTML version of the message</p>',
            attachments: {
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

    @route('post', '/files', uploader.any())
    actionFiles(req, res) {
        console.log('params:', req.params);
        console.log('query:', req.query);
        console.log('body:', req.body);
        console.log('files:', req.files);

        res.send('Ok');
    }
}
