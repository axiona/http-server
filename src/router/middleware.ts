import Context from '../context/context';
import Router from './router';
import MiddlewareType from '../middleware/middleware';
import Metadata from "./metadata/metadata";
import Null from "./metadata/null";
import Identity from "../../../function/dist/identity";
import Compose from "./compose";

export default function Middleware_<ContextType extends Context  = Context>(
    middleware: MiddlewareType<Context, ContextType> = Identity as MiddlewareType<Context, ContextType>,
    metadata : Metadata = Null(),
) : Router<ContextType> {

    return Compose<ContextType>(middleware, metadata, async (context, children) : Promise<Context|void>=>  {

        const next = await middleware(context);

        if(next) {

            for (const child of children) {

                await child.call(next);
            }
        }

        return next;
    });
}
