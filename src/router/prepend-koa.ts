import Router from './router';
import Server from '../server/server';
import Standard from "./standard";
import Koa from "koa";

export default function PrependKoa(server : Koa) : Router;
export default function PrependKoa<Type extends Router>(server : Koa, router: Type) : Type;
export default function PrependKoa<Type extends Router>(server : Koa, router: Type|Router = new Standard()) : Type|Router {

    server.use(async (context, next) => {

        return next().then(()=>router.call(context as any));

    });

    return router;
}