import Context from '../context/context.js';
import Router from './router.js';
import MiddlewareType from '../middleware/middleware.js';
import Metadata from './metadata/metadata.js';
import Null from './metadata/null.js';
import Identity from '@axiona/function/identity.js';
import Compose from './compose.js';

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
