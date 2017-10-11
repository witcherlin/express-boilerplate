import nodemailer from 'nodemailer';

import config from './index';

export default function () {
    const transport = nodemailer.createTransport(config.mailer);

    return function (req, res, next) {
        req.mailer = transport;

        next();
    };
}
