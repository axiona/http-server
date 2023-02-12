import Context from '../context/context.js';
import Router from './router.js';
import Catch from '../catch/catch.js';
import Middleware from '../middleware/middleware.js';
import Metadata from './metadata/metadata.js';
import Register from './metadata/register.js';
import RegisterChildren from './register-children.js';
import Null from './metadata/null.js';
import Registrable from '../registrable.ts/registrable.js';
import Middleware_ from './middleware.js';
import Catch_ from './catch.js';
import Callable from '../../../function/dist/callable.js';


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
