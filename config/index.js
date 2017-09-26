export default {
    env: process.env.NODE_ENV,
    port: process.env.PORT || 3000,
    mongoose: {
        uri: 'mongodb://127.0.0.1:27017/express-boilerplate'
    },
    security: {
        secret: 'df24treftww3546gerredfds',
        expiresIn: '24h'
    }
}
