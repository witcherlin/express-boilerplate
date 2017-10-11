export default {
    env: process.env.NODE_ENV,
    port: process.env.PORT || 3000,
    mongoose: {
        uri: 'mongodb://127.0.0.1:27017/express-boilerplate'
    },
    security: {
        secret: 'df24treftww3546gerredfds',
        expiresIn: '24h'
    },
    mailer: {
        host: 'smtp.zoho.eu',
        port: 465,
        secure: true,
        auth: {
            user: 'testing@kirinami.com',
            pass: 'kirinami'
        }
    }
};
