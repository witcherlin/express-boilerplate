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

        if (!req.isAuthenticated()) {
            return res.status(403).json({
                status: false,
                message: 'Not authenticated.'
            });
        }

        next();
    })(req, res, next);
}
