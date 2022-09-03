import Middleware from "../middleware/middleware";
import Context from "../context/context";
import Catch from "./catch";

export default function Passthrough<
    ContextType extends Context = Context
>(
    middleware: Middleware<ContextType>
) : Catch<ContextType> {

    return async function (error: Error, context: ContextType) {

        await middleware(context);

        throw error;
    };
}