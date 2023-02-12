import Router from './router.js';
import Server from '../server/server.js';
import Standard from './middleware.js';
import PrependKoa from './prepend-koa.js';

export default function PrependServer(server : Server) : Router;
export default function PrependServer<Type extends Router>(server : Server, router: Type) : Type;
export default function PrependServer<Type extends Router>(server : Server, router: Type|Router = Standard()) : Type|Router {

    return PrependKoa(server.koa, router);
}