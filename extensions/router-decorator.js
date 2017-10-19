import express from 'express';

export function router(match, ...middlewares) {
    match = match.trim().toLowerCase();
    middlewares = middlewares || [];

    return (target) => {
        target.prototype.$router = express.Router();
        target.prototype.$routing = express.Router();
        target.prototype.$mapping = target.prototype.$mapping || [];
        target.prototype.$children = target.prototype.$children || [];

        return () => {
            target.prototype.$children.forEach((child) => {
                const instance = new child();

                target.prototype.$mapping.push({
                    key: instance.constructor.name,
                    instance: instance,
                    method: 'use',
                    type: 'class'
                });
            });

            const instance = new target();
            const { $router, $routing, $mapping } = instance;

            Object.keys($mapping).forEach((key) => {
                const route = $mapping[key];

                if (route.type === 'class') {
                    $routing[route.method](route.instance.$router);
                } else if (route.type === 'method') {
                    const action = (req, res, next) => {
                        const action = instance[route.key].bind(instance)(req, res, next);

                        if (action instanceof Promise) {
                            action.catch(err => next(err));
                        }
                    };

                    $routing[route.method](route.match, ...route.middlewares, action);
                }
            });

            $router.use(match, ...middlewares, $routing);

            return instance;
        };
    };
}

export function children(...routers) {
    return (target) => {
        target.prototype.$children = target.prototype.$children || routers;
    };
}

export function route(method, match, ...middlewares) {
    method = method.trim().toLowerCase();
    match = match.trim().toLowerCase();
    middlewares = middlewares || [];

    return (target, key) => {
        target.$mapping = target.$mapping || [];

        target.$mapping.push({
            key,
            match,
            method,
            middlewares,
            type: 'method'
        });
    };
}
