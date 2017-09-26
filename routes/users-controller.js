import Router from '../extensions/router';

import User from '../models/user';

export default class UsersController extends Router {
    get root() {
        return '/users';
    }

    get routes() {
        return [
            ['get', '/', this.actionGetAllUsers],
            ['get', '/:id', this.actionGetUserById],
            ['put', '/', this.actionCreateUser],
            ['post', '/:id', this.actionUpdateUserById],
            ['delete', '/:id', this.actionDeleteUserById],
        ];
    }

    async actionGetAllUsers(req, res) {
        try {
            const users = await User.find({});

            res.json({
                users,
                message: 'Get all users'
            });
        }
        catch (err) {
            res.json({
                error: err,
                message: 'Error Get all users'
            });
        }
    }

    async actionGetUserById(req, res) {
        try {
            const user = await User.findOne({
                _id: req.params.id
            });

            res.json({
                user,
                message: `Get User by id: ${req.params.id}`
            });
        }
        catch (err) {
            res.json({
                error: err,
                message: `Error Get User by id: ${req.params.id}`
            });
        }
    }

    async actionCreateUser(req, res) {
        try {
            const user = await new User({
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
                phone: req.body.phone,
                subscriptions: req.body.subscriptions,
            }).save();

            res.json({
                user,
                message: 'Create new user'
            });
        }
        catch (err) {
            res.json({
                error: err.errors || err,
                message: 'Error Create new user'
            });
        }
    }

    async actionUpdateUserById(req, res) {
        try {
            const user = await User.findById(req.params.id);

            user.username = req.body.username;
            user.password = req.body.password;
            user.email = req.body.email;
            user.phone = req.body.phone;
            user.subscriptions = req.body.subscriptions;

            const updatedUser = await user.save();

            res.json({
                user: updatedUser,
                message: 'Update user by id: ' + req.params.id
            });
        }
        catch (err) {
            res.json({
                error: err.errors || err,
                message: `Error update user by id ${req.params.id}`
            });
        }
    }

    async actionDeleteUserById(req, res) {
        try {
            const affected = await User.remove({
                _id: req.params.id
            });

            res.json({
                affected,
                message: 'Delete user by id: ' + req.params.id
            });
        }
        catch (err) {
            res.json({
                error: err.errors || err,
                message: `Error Delete user by id ${req.params.id}`
            });
        }
    }
}
