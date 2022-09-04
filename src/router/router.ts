import Middleware from '../middleware/middleware';
import Catch from '../catch/catch';
import Context from '../context/context';
import Metadata from "./metadata/metadata";
import Callable from "../../../function/dist/callable";

export default interface Router<
    ContextType extends Context  = Context,
    // Type extends Middleware  = Middleware,
    Error extends Catch  = Catch,
>  {
    children : Router[];
    middleware : Middleware<Context, ContextType>|undefined;
    error : Error|undefined;
    parent : Router|undefined;
    metadata : Metadata;

    add<Next extends Context>(middleware : Middleware<ContextType, Next>) : Router<Next>;
    catch(errorHandler : Error) : Router<ContextType, Error>;
    call(context: Context) : Promise<Context|void>;
    extends<
        ENext extends Context,
        NextError extends Catch  = Catch,
    >(
        router: Callable<[this], Router<ENext, NextError>>
    ) : Router<ENext, NextError>;

}

