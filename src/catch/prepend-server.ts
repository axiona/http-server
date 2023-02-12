import Server from '../server/server.js';
import PrependKoa from './prepend-koa.js';
import Catch from './catch.js';

export default function PrependServer<Type extends Catch>(server : Server, handler: Type) : void {

    return PrependKoa(server.koa, handler);
}