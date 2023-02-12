import Middleware from '../middleware/middleware.js';
import Context from '../context/context.js';
import Catch from './catch.js';

export default function Passthrough<
    ContextType extends Context = Context
>(
    middleware: Middleware<ContextType>|Catch<ContextType>
) : Catch<ContextType> {

    return async function (context: ContextType, error: Error) {

        await middleware(context, error);

        throw error;
    };
}