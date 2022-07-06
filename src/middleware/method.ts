import Middleware from './middleware.js';
import Context from '../context/context.js';


export type MethodType<ContextType extends Context = Context> = Middleware<ContextType, ContextType> & {
    methods : string[]
};

export default function Method<ContextType extends Context>(
    ...methods : string[]
) : MethodType<ContextType> {

    methods = methods.map(method=>method.toUpperCase());

    const callable = function (context) {


        if(methods.includes(context.request.method) || methods.includes(context.request.method.toUpperCase())) {

            return context;
        }

    };

    return Object.assign(callable, {methods});

}
