import Router from './router';
import Server from '../server/server';

export default function AppendServer<Type extends Router>(server : Server, router: Type) : Type {

    server.koa.use((context, next) => {

        return router.call(context as any).then(next);
    });

    return router;
}