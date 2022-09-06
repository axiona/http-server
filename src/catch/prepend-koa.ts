import Koa from "koa";
import Catch from "./catch";

export default function PrependKoa<Type extends Catch>(server : Koa, handler: Type) : void {

    server.use((context, next) => {

        return next().catch(error => handler(error, context));

    });

}