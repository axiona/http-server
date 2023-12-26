import Route from '@axiona/http/route/route.js';
import {PathOptionDefault, PathParameters} from './path.js';
import {MethodPathArgumentsOption} from './method-path.js';
import Middleware from './middleware.js';
import Method from './method.js';
import Context from '../context/context.js';


export function RouteOptionsParameters<
    ContextType extends Context,
>(
    routes : Route[],
    option : Partial<Omit<MethodPathArgumentsOption<Record<string, string>, string, string>,  'storage'|'argument'>> = PathOptionDefault,
) : Middleware<ContextType, ContextType> {

    const middlewareMethod = Method('OPTIONS');
    const middlewarePaths : [Middleware, Route][] = [];

    for (const route of routes) {

        middlewarePaths.push([
            PathParameters(route.path, option),
            route
        ]);
    }

    const middleware = ((context : Context) => {

        const ctx = middlewareMethod(context);

        if(ctx) {

            const methods = middlewarePaths
                .filter(([middleware, route])=> middleware(ctx as Context))
                .map(([middleware, route])=>route.method);

            if(methods.length) {

                context.response.status = 200;
                context.body = undefined;
                context.set('Allow', methods.join(', '));
                return context;
            }
        }

        return ;

    });

    const register = function (router) {

        const middlewares = middlewarePaths.map(([middleware])=>middleware);

        for (const middleware of [middlewareMethod, ...middlewares]) {

            if(middleware.register) {

                middleware.register(router);
            }
        }
    };

    return Object.assign(middleware, middlewareMethod, {register}) as Middleware<ContextType, ContextType>;

}

export function RouteOptionsParameter<
    ContextType extends Context,
>(  {
        routes,
        option = PathOptionDefault
    } : {
        routes : Route[],
        option : Partial<Omit<MethodPathArgumentsOption<Record<string, string>, string, string>,  'storage'|'argument'>>,
    }
) : Middleware<ContextType, ContextType> {

    return RouteOptionsParameters(routes, option);
}

namespace BodyJson {

    export const Parameters = RouteOptionsParameters;
    export const Parameter = RouteOptionsParameter;
}

export default BodyJson;
