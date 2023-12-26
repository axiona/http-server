import Callable from '@axiona/function/callable.js';
import Middleware from '../middleware/middleware.js';
import Context from '../context/context.js';
import Catch from './catch.js';
import Guard from "@axiona/boolean/function/guard.js";

export function ErrorParameters<ContextType extends Context, ErrorType extends Error = Error>(
    validation : Guard<Error, ErrorType>,
    middleware: Middleware<ContextType>|Catch<ContextType, ErrorType>
) : Catch<ContextType, ErrorType>;

export function ErrorParameters<ContextType extends Context>(
    validation : Callable<[Error], boolean>,
    middleware: Middleware<ContextType>|Catch<ContextType>
) : Catch<ContextType, Error>;

export function ErrorParameters<ContextType extends Context, ErrorType extends Error>(
    validation : Callable<[Error], boolean>|Guard<Error, ErrorType>,
    middleware: Middleware<ContextType>|Catch<ContextType, ErrorType>
) : Catch<ContextType, ErrorType> {

    return async function (context, error) {

        if(validation(error)) {

            await middleware(context, error);

        } else {

            throw error;
        }
    };
}

export function ErrorParameter<ContextType extends Context, ErrorType extends Error = Error>(
    {
        validation,
        middleware
    } : {
        validation : Callable<[ErrorType], boolean>,
        middleware: Middleware<ContextType>|Catch<ContextType, ErrorType>
    }

) {
    return ErrorParameters(validation, middleware);
}

namespace Error {
    export const Parameters = ErrorParameters;
    export const Parameter = ErrorParameter;
}
export default Error;
