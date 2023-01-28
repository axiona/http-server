import Context from '../context/context';
import Router from './router';
import Catch from '../catch/catch';
import Middleware from '../middleware/middleware';
import Metadata from "./metadata/metadata";
import Register from "./metadata/register";
import RegisterChildren from "./register-children";
import Null from "./metadata/null";
import Registrable from "../registrable.ts/registrable";
import Middleware_ from "./middleware";
import Catch_ from "./catch";
import Callable from "../../../function/dist/callable";


export default function Compose<ContextType extends Context  = Context>(
    registrable : Registrable,
    metadata : Metadata = Null(),
    call : (context: Context, children : Router[], metadata : Metadata) => Promise<Context|void>
) : Router<ContextType> {

    return new ComposeClass(registrable, metadata, call);

}

export class ComposeClass<ContextType extends Context  = Context> implements Router<ContextType> {

    public children : Router[] = [];
    #call: (context: Context, children : Router[], metadata : Metadata) => Promise<Context|void>;

    constructor(
        registrable : Registrable,
        public metadata : Metadata = Null(),
        call: (context: Context, children : Router[], metadata : Metadata) => Promise<Context|void>
    ) {

        this.metadata = Register(this.metadata, registrable);
        this.#call = call;
    }

    next<Next extends Context>(middleware: Middleware<ContextType, Next>): Router<Next> {

        return RegisterChildren(metadata => Middleware_(middleware, metadata), this.metadata, this.children);

    }

    catch<ErrorType extends Error>(errorHandler : Catch<ContextType, ErrorType>) : Router<ContextType> {

        return RegisterChildren(metadata => Catch_(errorHandler, metadata), this.metadata, this.children);
    }

    extends<ContextNext extends Context>(
        router: (router:Router<ContextType>) => Router<ContextNext>
    ) : Router<ContextNext> {

        return router(this);
    }

    call(context: Context) : Promise<Context|void> {

        context.router = this.metadata;
        return this.#call(context, this.children, this.metadata);
    }
}
