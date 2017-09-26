import express from 'express';

export default class Router {
    get path() {
        return '/';
    }

    get middlewares() {
        return []
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

            const [method, ...middleware] = route;

            if (middleware.length) {
                for (let i = 0; i < middleware.length; i++) {
                    if (typeof middleware[i] !== 'function') {
                        continue;
                    }

                    if (middleware[i].prototype instanceof Router) {
                        middleware[i] = new middleware[i]().router;
                    } else {
                        middleware[i] = middleware[i].bind(this);
                    }
                }

                subRouter[method.toLowerCase()](...middleware);
            }
        });

        router.use(path, ...middlewares, subRouter);

        this.router = router;
    }
}
