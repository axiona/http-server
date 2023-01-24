import Context from '../context/context';
import Router from './router';
import Catch from '../catch/catch';
import Middleware from '../middleware/middleware';
import Metadata from "./metadata/metadata";
import Null from "./metadata/null";
import Identity from "../../../function/dist/identity";
import Compose from "./compose";
import Register from "./metadata/register";
import Clone from "./metadata/clone";

export default function Middleware<
    ContextType extends Context  = Context,
    Error extends Catch  = Catch,
> (
    middleware : Middleware<Context, ContextType> = Identity as Middleware<Context, ContextType>,
    metadata : Metadata = Null(),
    parent : Middleware|null = null,
) : Router<ContextType>  {

    const children : Router[] = [];

    let nextMetadata = Register(metadata, middleware);

    const register = (meta : Metadata) : Metadata => {

        return Register(meta, middleware);
    };

    const callback = async function (context : Context) {

        context.router = nextMetadata;
        const contextNext = await middleware(context);

        if(contextNext) {

            for (const next of children) {

                await next(contextNext);
            }
        }

        return contextNext;
    };

    return Compose(nextMetadata, children, callback, register, parent) as Router<ContextType>;

}

