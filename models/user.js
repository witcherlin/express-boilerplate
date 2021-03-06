import bcrypt from 'bcrypt';
import uniqid from 'uniqid';
import shuffle from 'lodash/shuffle';
import mongoose, { Schema, SchemaTypes as Types } from 'mongoose';
import { isEmail } from 'validator';

const userSchema = new Schema({
    username: {
        type: Types.String,
        minlength: 6,
        maxlength: 24,
        required: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: Types.String,
        minlength: 6,
        maxlength: 64,
        required: true,
        trim: true
    },
    email: {
        type: Types.String,
        validate: [
            {
                validator: value => isEmail(value),
                message: '{VALUE} is not email!'
            },
            {
                validator: async function (value) {
                    try {
                        const user = await User.findOne({
                            email: value
                        });

                        if (!this.isNew) {
                            return !user || this._id.toString() === user._id.toString();
                        }

                        return !user;
                    }
                    catch (err) {
                        return false;
                    }
                },
                message: '{VALUE} is not unique!'
            }
        ],
        required: true
    },
    phone: {
        type: Types.String,
        validate: [
            {
                validator: value => /\d{3}-\d{3}-\d{4}/.test(value),
                message: '{VALUE} is not phone!'
            }
        ]
    },
    subscriptions: [{
        type: Types.ObjectId,
        ref: 'Article'
    }],
    token: {
        type: Types.String
    },
    code: {
        type: Types.String
    },
    status: {
        type: Types.String,
        enum: ['unconfirmed', 'forgotten', 'active'],
        default: 'unconfirmed'
    }
}, {
    timestamps: true
});

userSchema.methods.generateCode = function (length = 5) {
    return shuffle(uniqid().split('')).join('').slice(length);
};

userSchema.methods.generateToken = function () {
    return shuffle((uniqid() + this._id).split('')).join('');
};

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.pre('save', function (next) {
    if (this.isModified('password') || this.isNew) {
        this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10), null);
    }

    next();
});

const User = mongoose.model('User', userSchema);

export default User;
