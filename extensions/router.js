import express from 'express';

export default class Router {
    get root() {
        return '/';
    }

    get routes() {
        return [];
    }

    constructor() {
        const routes = this.routes;

        const rootRouter = express.Router();

        if (!routes.length) {
            return rootRouter;
        }

        const subRouter = express.Router();

        routes.forEach((route) => {
            if (route.length < 2) {
                throw new Error('Route params length');
            }

            if (typeof route[0] !== 'string') {
                throw new Error('Undefined router key');
            }

            const [method, ...middleware] = route;

            if (middleware.length) {
                for (let i = 0; i < middleware.length; i++) {
                    if (typeof middleware[i] !== 'function') {
                        continue;
                    }

                    if (middleware[i].prototype instanceof Router) {
                        middleware[i] = new middleware[i]();
                    } else {
                        middleware[i] = middleware[i].bind(this);
                    }
                }

                subRouter[method.toLowerCase()].call(subRouter, ...middleware);
            }
        });

        rootRouter.use(this.root, subRouter);

        return rootRouter;
    }
}
