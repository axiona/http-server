import ErrorHandlerType from '../catch/catch';
import Context from '../context/context';
import Router from './router';
import Catch from '../catch/catch';
import Callable from '@alirya/function/callable';
import Middleware from '../middleware/middleware';
import Metadata from "./metadata/metadata";
import Null from "./metadata/null";
import Clone from "./metadata/clone";

export default class Standard<
    ContextType extends Context  = Context,
    // Type extends Middleware  = Middleware,
    Error extends Catch  = Catch,
> implements Router<ContextType, Error> {

    children : Router[] = [];

    constructor(
        public middleware : Middleware<Context, ContextType>|undefined = undefined,
        public error : Error|undefined = undefined,
        public parent : Router|undefined = undefined,
        public metadata : Metadata = Null(),
    ) {

        for(const handler of [middleware, error]) {

            if(handler && handler.register) {

                handler.register(this);
            }
        }
    }

    extends<
        ENext extends Context,
        NextError extends Catch  = Catch,
    >(
        router: Callable<[this], Router<ENext, NextError>>
    ) : Router<ENext, NextError> {

        return router(this);
    }

    add<Next extends Context>(middleware : Middleware<ContextType, Next>) : Router<Next> {

        const router = new Standard(middleware, undefined, this, Clone(this.metadata));

        this.children.push(router);

        return router as Router<Next> ;
    }

    catch(errorHandler : ErrorHandlerType) {

        const router =  new Standard(undefined, errorHandler, this, Clone(this.metadata));

        this.children.push(router);

        return router;
    }

    protected async tryExecute<Return>(callable : Callable<[], Return>, context: Context) : Promise<Return|undefined> {

        try {

            return await callable();

        } catch (error) {

            if(this.error) {

                error = await this.error(error, context);
            }

            if(error) {

                throw error;
            }
        }
    }

    //
    // async call(context: Context) : Promise<Context|void> {
    //
    //     context.router = this;
    //
    //     if(this.middleware) {
    //
    //         context = await this.tryExecute(()=> {
    //
    //             context.router = this;
    //
    //             return (this.middleware as Middleware)(context);
    //
    //         }, context) as Context;
    //     }
    //
    //
    //     if(context) {
    //
    //         for (const children of this.children) {
    //
    //             await this.tryExecute(()=> {
    //
    //                 context.router = this;
    //
    //                 return  children.call(context);
    //
    //             }, context) as Context;
    //         }
    //
    //         return context as Context;
    //
    //     }
    //
    //     return context;
    // }

    async call(context: Context) : Promise<Context|void> {

        // context.router = this;

        if(this.middleware) {

            try {
                context.router = this;

                context = await (this.middleware as Middleware)(context) as Context;
                // return await callable();

            } catch (error) {

                if(this.error) {

                    error = await this.error(error, context);
                }

                if(error) {

                    throw error;
                }
            }

            // context = await this.tryExecute(()=> {

            // }, context) as Context;
        }


        if(context) {

            for (const children of this.children) {

                try {

                    context.router = this;

                    await children.call(context);

                } catch (error) {

                    if(this.error) {

                        error = await this.error(error, context);
                    }

                    if(error) {

                        throw error;
                    }
                }

                // await this.tryExecute(()=> {

                    // context.router = this;
                    //
                    // return  children.call(context);

                // }, context) as Context;
            }

            // return context as Context;

        }

        return context;
    }

}

