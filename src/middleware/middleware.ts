import Context from '../context/context.js';
import Router from '../router/router.js';


export default interface Middleware<
    Argument extends Context = Context,
    Return extends Context = Argument
> {

    register?:(context: Router) => void;
    /*<Arg extends Argument>*/(context: Argument) : MiddlewareReturn<Return>;
}


export type MiddlewareInferNext<Type> = Type  extends Middleware<any, infer Argument> ? Argument : never;
export type MiddlewareInferCurrent<Type> = Type  extends Middleware<infer Return, any> ? Return : never;
export type MiddlewareReturn<Type> = Type|Promise<Type|void>|void;
