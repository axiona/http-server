import Router from './router.js';
import Server from '../server/server.js';
import Standard from './middleware.js';
import AppendKoa from './append-koa.js';

export default function AppendServer(server : Server) : Router;
export default function AppendServer<Type extends Router>(server : Server, router: Type) : Type;
export default function AppendServer<Type extends Router>(server : Server, router: Type|Router = Standard()) : Type|Router {

    return AppendKoa(server.koa, router);
}