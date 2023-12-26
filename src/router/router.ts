import Middleware from '../middleware/middleware.js';
import Catch from '../catch/catch.js';
import Context from '../context/context.js';
import Metadata from "./metadata/metadata.js";
import Callable from '@axiona/function/callable.js';

export default interface Router<
    ContextType extends Context  = Context,
>  {
    children : Router[];
    metadata : Metadata;

    extends<ContextNext extends Context>(
        router: (router:Router<ContextType>) => Router<ContextNext>
    ) : Router<ContextNext>;

    scope<Next extends Context = ContextType>(callback : Callable<[Router<ContextType>]>) : Router<Next>;
    next<Next extends Context>(middleware : Middleware<ContextType, Next>) : Router<Next>;
    catch<ErrorType extends Error>(errorHandler : Catch<ContextType, ErrorType>) : Router<ContextType>;
    call(context: Context) : Promise<Context|void>;
}



