import Middleware from './middleware';
import Context from '../context/context';
import Router from "../router/router";

export default function Method<ContextType extends Context>(
    ...methods : string[]
) : Middleware<ContextType, ContextType> {

    methods = methods.map(method=>method.toUpperCase());

    const callable = function (context) {

        if(methods.includes(context.request.method) || methods.includes(context.request.method.toUpperCase())) {

            return context;
        }
    };

    const register = function (router : Router)  {

        router.metadata.method.push(...methods);
    };

    return Object.assign(callable, {register});

}
