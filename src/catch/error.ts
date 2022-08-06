import Callable from "../../../function/dist/callable";
import Middleware from "../middleware/middleware";
import Context from "../context/context";
import Catch from "./catch";

export function ErrorParameters<ContextType extends Context = Context>(
    validation : Callable<[Error], boolean>,
    middleware: Middleware<ContextType>
) : Catch<ContextType> {

    return async function (error, context) {

        if(validation(error)) {

            await middleware(context);

        } else {

            return error;
        }
    };
}

export function ErrorParameter<ContextType extends Context = Context>(
    {
        validation,
        middleware
    } : {
        validation : Callable<[Error], boolean>,
        middleware: Middleware<ContextType>
    }

) {
    return ErrorParameters(validation, middleware);
}

namespace Error {
    export const Parameters = ErrorParameters;
    export const Parameter = ErrorParameter;
}
export default Error;