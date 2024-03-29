import {Middleware as KoaMiddleware} from "koa";
import Catch from '../../catch/catch.js';

export default function Prepend<
    CatchType extends Catch
    >(
    catches: CatchType
) : KoaMiddleware {

    return async function (context, next) {

        try {

            await next();

        } catch (error) {

            catches(context, error);
        }

    };
}