import Context from '../context/context';
import Union from "@alirya/promise/union";
import Metadata from "../router/metadata/metadata";


export default interface Middleware<
    Argument extends Context = Context,
    Return extends Context = Argument
> {

    /**
     * called on registered to router
     * @param context
     */
    register?:(router: Metadata) => Metadata;
    (context: Argument) : MiddlewareReturn<Return>;
}


export type MiddlewareInferNext<Type> = Type  extends Middleware<any, infer Argument> ? Argument : never;
export type MiddlewareInferCurrent<Type> = Type  extends Middleware<infer Return, any> ? Return : never;
export type MiddlewareReturn<Type> = Union<Type|void>;
