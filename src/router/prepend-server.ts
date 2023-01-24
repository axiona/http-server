import Router from './router';
import Server from '../server/server';
import Standard from "./middleware";
import PrependKoa from "./prepend-koa";

export default function PrependServer(server : Server) : Router;
export default function PrependServer<Type extends Router>(server : Server, router: Type) : Type;
export default function PrependServer<Type extends Router>(server : Server, router: Type|Router = Standard()) : Type|Router {

    return PrependKoa(server.koa, router);
}