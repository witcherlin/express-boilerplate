import passport from 'passport';

export default function isBearerAuthenticate(req, res, next) {
    passport.authenticate('bearer', { session: false }, (err, user) => {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.status(401).json({
                status: false,
                message: 'Incorrect token.'
            });
        }

        req.login(user, next);
    })(req, res, next);
}
