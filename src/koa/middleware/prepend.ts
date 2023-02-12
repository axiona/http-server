import {Middleware as KoaMiddleware} from "koa";
import Middleware from '../../middleware/middleware.js';

export default function Prepend<
    MiddlewareType extends Middleware
>(
    middleware: MiddlewareType
) : KoaMiddleware {

    return async function (context, next) {

        next().then(()=>middleware(context));
    };
}