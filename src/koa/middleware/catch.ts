import {Middleware as KoaMiddleware} from "koa";
import Middleware from "../../middleware/middleware";
import Catch from "../../catch/catch";

export default function Prepend<
    CatchType extends Catch
    >(
    catches: CatchType
) : KoaMiddleware {

    return async function (context, next) {

        try {

            await next();

        } catch (error) {

            catches(error, context);
        }

    };
}