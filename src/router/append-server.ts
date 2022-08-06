import Router from './router';
import Server from '../server/server';
import Standard from "./standard";

export default function AppendServer(server : Server) : Router;
export default function AppendServer<Type extends Router>(server : Server, router: Type) : Type;
export default function AppendServer<Type extends Router>(server : Server, router: Type|Router = new Standard()) : Type|Router {

    server.koa.use((context, next) => {

        return router.call(context as any).then(next);
    });

    return router;
}