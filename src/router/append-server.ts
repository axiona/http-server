import Router from './router';
import Server from '../server/server';
import Standard from "./middleware";
import AppendKoa from "./append-koa";

export default function AppendServer(server : Server) : Router;
export default function AppendServer<Type extends Router>(server : Server, router: Type) : Type;
export default function AppendServer<Type extends Router>(server : Server, router: Type|Router = Standard()) : Type|Router {

    return AppendKoa(server.koa, router);
}