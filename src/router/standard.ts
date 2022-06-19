import MiddlewareType from '../middleware/middleware';
import ErrorHandlerType from '../error-handler/error-handler';
import Context from '../context/context';
import Router from './router';
import ErrorHandler from '../error-handler/error-handler';
import Callable from '../../../function/dist/callable';
import Middleware from '../middleware/middleware';
import MiddlewareInferNext from '../context/middleware-infer-next';

export default class Standard<
    Type extends MiddlewareType  = MiddlewareType,
    Error extends ErrorHandler  = ErrorHandler,
> implements Router<Type, Error> {

    children : Router[] = [];

    constructor(
        public middleware : Type|undefined = undefined,
        public error : Error|undefined = undefined,
        public parent : Router|undefined = undefined,
        public metadata : Record<PropertyKey, any> = {},
    ) {

        for(const handler of [middleware, error]) {

            if(handler && handler.register) {

                handler.register(this);
            }
        }
    }

    add<Next extends Context>(middleware : Middleware<MiddlewareInferNext<Type>, Next>) : Router<Middleware<Next>> {

        // if(middleware.register) {
        //
        //     middleware.register(this);
        // }

        const router =  new Standard(middleware, undefined, this, {});

        this.children.push(router);

        return router as Router<Middleware<Next>> ;
    }

    catch(errorHandler : ErrorHandlerType) {

        // if(errorHandler.register) {
        //
        //     errorHandler.register(this);
        // }

        const router =  new Standard(undefined, errorHandler, this, {});

        this.children.push(router);

        return router;
    }

    protected async tryExecute<Return>(callable : Callable<[], Return>, context: Context) : Promise<Return|undefined> {

        try {

            return await callable();

        } catch (error) {

            if(this.error) {

                await this.error(error, context);

            } else {

                throw error;
            }
        }
    }


    async call(context: Context) : Promise<Context|void> {

        context.router = this;

        context = await this.tryExecute(()=> {

            if(this.middleware) {

                context.router = this;

                return this.middleware(context);
            }

            return context as Context;

        }, context) as Context;


        if(context) {

            for (const children of this.children) {

                await this.tryExecute(()=> {

                    context.router = this;

                    return  children.call(context);

                }, context) as Context;
            }

            return context as Context;

        }

        return context;
    }

}

