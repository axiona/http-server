import Router from './router';
import Standard from "./middleware";
import Koa from "koa";

export default function AppendKoa(server : Koa) : Router;
export default function AppendKoa<Type extends Router>(server : Koa, router: Type) : Type;
export default function AppendKoa<Type extends Router>(server : Koa, router: Type|Router = Standard()) : Type|Router {

    server.use(async (context, next) => {

        return next().then(()=>router(context as any));

    });

    return router;
}