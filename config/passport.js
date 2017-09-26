import passport from 'passport';
import BearerStrategy from 'passport-http-bearer';

import User from '../models/user';

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, done);
});

passport.use(new BearerStrategy(async (token, done) => {
    try {
        const user = await User.findOne({ token });

        if (!user) {
            return done(null, false);
        }

        done(null, user);
    }
    catch (err) {
        done(err);
    }
}));

export default passport;
