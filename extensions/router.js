import express from 'express';

export default class Router {
    get path() {
        return '/';
    }

    get middlewares() {
        return [];
    }

    get routes() {
        return [];
    }

    constructor() {
        const path = this.path;
        const middlewares = this.middlewares;
        const routes = this.routes;

        const router = express.Router();

        if (!routes.length) {
            return router;
        }

        const subRouter = express.Router();

        routes.forEach((route) => {
            if (route.length < 2) {
                throw new Error('Route params length');
            }

            if (typeof route[0] !== 'string') {
                throw new Error('Undefined router key');
            }

            const [method, ...actions] = route;

            if (actions.length) {
                for (let i = 0; i < actions.length; i++) {
                    if (typeof actions[i] !== 'function') {
                        continue;
                    }

                    if (actions[i].prototype instanceof Router) {
                        actions[i] = new actions[i]().router;
                    } else {
                        const fn = actions[i].bind(this);

                        actions[i] = (...args) => {
                            const action = fn(...args);

                            if (args.length >= 3 && action instanceof Promise) {
                                const next = args.length === 4 ? args[3] : args[2];

                                action.catch(err => next(err));
                            }
                        };
                    }
                }

                subRouter[method.toLowerCase()](...actions);
            }
        });

        router.use(path, ...middlewares, subRouter);

        this.$router = router;
    }
}
