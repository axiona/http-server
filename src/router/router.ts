import Middleware from '../middleware/middleware';
import ErrorHandler from '../error-handler/error-handler';
import Context from '../context/context';
import MiddlewareInferCurrent from '../context/middleware-infer-current';
import MiddlewareInferNext from '../context/middleware-infer-next';

export default interface Router<
    Type extends Middleware  = Middleware,
    Error extends ErrorHandler  = ErrorHandler,
> {
    children : Router[];
    middleware : Type|undefined;
    error : Error|undefined;
    parent : Router|undefined;
    metadata : Record<PropertyKey, any>;

    add<Next extends Context>(middleware : Middleware<MiddlewareInferNext<Type>, Next>) : Router<Middleware<Next>>;
    catch(errorHandler : Error) : Router<Type, Error>;
    call(context: Context) : Promise<Context|void>;

}
