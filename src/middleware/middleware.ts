import Context from '../context/context.js';
import Union from "@axiona/promise/union.js";
import Registrable from '../registrable.ts/registrable.js';


export default interface Middleware<
    Argument extends Context = Context,
    Return extends Context = Argument
> extends Registrable {

    (context: Argument) : MiddlewareReturn<Return>;
}


export type MiddlewareInferNext<Type> = Type  extends Middleware<any, infer Argument> ? Argument : never;
export type MiddlewareInferCurrent<Type> = Type  extends Middleware<infer Return, any> ? Return : never;
export type MiddlewareReturn<Type> = Union<Type|void>;
