import passport from 'passport';
import LocalStrategy from 'passport-local';
import BearerStrategy from 'passport-http-bearer';

import User from '../models/user';

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, done);
});

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, async (username, password, done) => {
    try {
        const user = await User.findOne({
            email: username
        });

        if (!user) {
            return done(null, false, {
                message: 'Incorrect email.'
            });
        }

        if (!user.comparePassword(password)) {
            return done(null, false, {
                message: 'Incorrect password.'
            });
        }

        user.token = Math.random();
        user.save();

        done(null, user);
    }
    catch (err) {
        done(err);
    }
}));

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
