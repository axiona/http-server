import Context from '../context/context.js';
import Middleware from './middleware.js';
import Callable from '@axiona/function/callable.js';
import ResponseEnd from "../http/reponse/promise/response-end.js";

export function ResponseEndParameters<ContextType extends Context>(
    middleware : Middleware<ContextType, ContextType>,
    error : Callable<[Error]> = console.error
) : Middleware<ContextType> {

    return function (context) {

        ResponseEnd(context.res).then(()=>{

            middleware(context);

        }).catch(error);

        return context;
    };
}


export function ResponseEndParameter<ContextType extends Context> (
    {
        middleware,
        error = console.error
    } : {
        middleware : Middleware<ContextType, ContextType>
        error ?: Callable<[Error]>,
    }
) {
    return ResponseEndParameters(middleware, error);
}

namespace PrintTransaction {
    export const Parameters = ResponseEndParameters;
    export const Parameter = ResponseEndParameter;
}

export default PrintTransaction;
