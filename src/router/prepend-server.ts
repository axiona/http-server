import Router from './router';
import Server from '../server/server';
import Standard from "./standard";

export default function PrependServer(server : Server) : Router;
export default function PrependServer<Type extends Router>(server : Server, router: Type) : Type;
export default function PrependServer<Type extends Router>(server : Server, router: Type|Router = new Standard()) : Type|Router {

    server.koa.use(async (context, next) => {

        return next().then(()=>router.call(context as any));

    });

    return router;
}