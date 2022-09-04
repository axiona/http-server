import Router from './router';
import Standard from "./standard";
import Koa from "koa";
import Catch from "./catch";

export default function PrependKoa<Type extends Catch>(server : Koa, handler: Type) : Type|Router {

    server.use(async (context, next) => {

        try {

            return next();

        } catch (error) {

            handler(error, context);
        }

    });

    return handler;
}