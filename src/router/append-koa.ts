import Router from './router';
import Server from '../server/server';
import Standard from "./standard";
import Koa from "koa";

export default function AppendKoa(server : Koa) : Router;
export default function AppendKoa<Type extends Router>(server : Koa, router: Type) : Type;
export default function AppendKoa<Type extends Router>(server : Koa, router: Type|Router = new Standard()) : Type|Router {

    server.use((context, next) => {

        return router.call(context as any).then(next);
    });

    return router;
}