import Router from './router.js';
import Standard from './middleware.js';
import Koa from "koa";

export default function PrependKoa(server : Koa) : Router;
export default function PrependKoa<Type extends Router>(server : Koa, router: Type) : Type;
export default function PrependKoa<Type extends Router>(server : Koa, router: Type|Router = Standard()) : Type|Router {

    server.use(async (context, next) => {

        const contextNext = await router.call(context);

        if(contextNext) {

            return next();
        }
    });

    return router;
}