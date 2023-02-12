import Middleware from './middleware.js';
import Context from '../context/context.js';
import Metadata from '../router/metadata/metadata.js';

export default function Method<ContextType extends Context>(
    ...methods : string[]
) : Middleware<ContextType, ContextType> {

    methods = methods.map(method=>method.toUpperCase());

    const callable = function (context) {

        if(methods.includes(context.request.method) || methods.includes(context.request.method.toUpperCase())) {

            return context;
        }
    };

    const register = function (router : Metadata) : Metadata {

        router.method.push(...methods);
        return router;
    };

    return Object.assign(callable, {register});

}
