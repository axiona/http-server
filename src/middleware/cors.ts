import KoaCors, {Options} from "@koa/cors";
import Context from '../context/context.js';
import Middleware from './middleware.js';

export default function Cors<
    ContextType extends Context = Context
>(
    option: Options = {}
) : Middleware<ContextType> {

    return function (context) {

        return new Promise((resolve, reject) => {

            try {

                KoaCors(option)(context as ContextType & {state:{}}, () => {
                   return Promise.resolve(resolve(context));
                });

            } catch (error) {

                reject(error);
            }

            resolve();

        });

    };
}
