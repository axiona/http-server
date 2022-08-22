import Context from '../context/context';
import Router from '../router/router';
import Union from "@alirya/promise/union";


export default interface Middleware<
    Argument extends Context = Context,
    Return extends Context = Argument
> {

    /**
     * called on registered to router
     * @param context
     */
    register?:(router: Router) => void;
    (context: Argument) : MiddlewareReturn<Return>;
}


export type MiddlewareInferNext<Type> = Type  extends Middleware<any, infer Argument> ? Argument : never;
export type MiddlewareInferCurrent<Type> = Type  extends Middleware<infer Return, any> ? Return : never;
export type MiddlewareReturn<Type> = Union<Type|void>;
