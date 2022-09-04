import Server from '../server/server';
import PrependKoa from "./prepend-koa";
import Catch from "./catch";

export default function PrependServer<Type extends Catch>(server : Server, handler: Type) : void {

    return PrependKoa(server.koa, handler);
}