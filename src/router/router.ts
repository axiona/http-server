import Middleware from '../middleware/middleware';
import Catch from '../catch/catch';
import Context from '../context/context';
import Metadata from "./metadata/metadata";

export default interface Router<
    ContextType extends Context  = Context,
    Error extends Catch  = Catch,
> extends Middleware  {
    children : Router[];
    parent : Router|null;
    metadata : Metadata;

    add<Next extends Context>(middleware : Middleware<ContextType, Next>) : Router<Next>;
    catch(errorHandler : Error) : Router<ContextType, Error>;

}

