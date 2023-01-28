import Context from '../context/context';
import Union from "@alirya/promise/union";
import Registrable from "../registrable.ts/registrable";


export default interface Middleware<
    Argument extends Context = Context,
    Return extends Context = Argument
> extends Registrable {

    (context: Argument) : MiddlewareReturn<Return>;
}


export type MiddlewareInferNext<Type> = Type  extends Middleware<any, infer Argument> ? Argument : never;
export type MiddlewareInferCurrent<Type> = Type  extends Middleware<infer Return, any> ? Return : never;
export type MiddlewareReturn<Type> = Union<Type|void>;
