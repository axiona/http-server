import Router from './router';
import Server from '../server/server';
import Standard from "./standard";
import PrependKoa from "./prepend-koa";
import Catch from "./catch";

export default function PrependServer<Type extends Catch>(server : Server, handler: Type) : Type|Router {

    return PrependKoa(server.koa, handler);
}