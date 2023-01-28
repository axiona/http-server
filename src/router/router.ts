import Middleware from '../middleware/middleware';
import Catch from '../catch/catch';
import Context from '../context/context';
import Metadata from "./metadata/metadata";
import Callable from "../../../function/dist/callable";

export default interface Router<
    ContextType extends Context  = Context,
>  {
    children : Router[];
    metadata : Metadata;

    extends<ContextNext extends Context>(
        router: (router:Router<ContextType>) => Router<ContextNext>
    ) : Router<ContextNext>;

    next<Next extends Context>(middleware : Middleware<ContextType, Next>) : Router<Next>;
    catch<ErrorType extends Error>(errorHandler : Catch<ContextType, ErrorType>) : Router<ContextType>;
    call(context: Context) : Promise<Context|void>;
}



