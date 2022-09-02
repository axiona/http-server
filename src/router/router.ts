import Middleware from '../middleware/middleware';
import Catch from '../catch/catch';
import Context from '../context/context';
import MiddlewareInferNext from '../context/middleware-infer-next';
import Metadata from "./metadata/metadata";
import Callable from "../../../function/dist/callable";

export default interface Router<
    Type extends Middleware  = Middleware,
    Error extends Catch  = Catch,
>  {
    children : Router[];
    middleware : Type|undefined;
    error : Error|undefined;
    parent : Router|undefined;
    metadata : Metadata;

    add<Next extends Context>(middleware : Middleware<MiddlewareInferNext<Type>, Next>) : Router<Middleware<Next>>;
    catch(errorHandler : Error) : Router<Type, Error>;
    call(context: Context) : Promise<Context|void>;
    extends<
        ENext extends Context,
        NextError extends Catch  = Catch,
    >(
        router: Callable<[this], Router<Middleware<ENext>, NextError>>
    ) : Router<Middleware<ENext>, NextError>;

}

