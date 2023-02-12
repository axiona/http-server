import Router from './router.js';
import Standard from './middleware.js';
import Koa from "koa";

export default function AppendKoa(server : Koa) : Router;
export default function AppendKoa<Type extends Router>(server : Koa, router: Type) : Type;
export default function AppendKoa<Type extends Router>(server : Koa, router: Type|Router = Standard()) : Type|Router {

    server.use(async (context, next) => {

        return next().then(()=>router.call(context as any));

    });

    return router;
}