import Context from '../context/context';
import {PathArgument, PathArgumentsOption, PathOptionDefault, PathParameters, PathReturn} from "./path";
import Method from "./method";
import Middleware from "../router/middleware";
import Identity from "../../../function/dist/identity";
import Extends from "./extends";

export type MethodPathReturn<
    ArgumentType extends Record<string, string> = Record<string, string>,
    Argument extends string = string,
    Storage extends string = string,
    ContextType extends Context = Context,
> = PathReturn<
    ArgumentType,
    Argument,
    Storage,
    ContextType
    >;

export type MethodPathArgumentsOption<
    ArgumentType extends Record<string, string>,
    Argument extends string,
    Storage extends string,
> = PathArgumentsOption<ArgumentType, Argument, Storage>;


export function MethodPathParameters<
    ArgumentType extends Record<string, string>,
    Argument extends string = 'pathParameter',
    ContextType extends Context = Context,
    >(
    method : string,
    path : string[]|string,
) : MethodPathReturn<ArgumentType, Argument, 'paths', ContextType>;

export function MethodPathParameters<
    ArgumentType extends Record<string, string>,
    Argument extends string = 'pathParameter',
    ContextType extends Context = Context,
    >(
    method : string,
    path : string[]|string,
    option : Omit<MethodPathArgumentsOption<ArgumentType, Argument, 'paths'>, 'storage'>,
) : MethodPathReturn<ArgumentType, Argument, 'paths', ContextType>;

export function MethodPathParameters<
    ArgumentType extends Record<string, string>,
    ContextType extends Context = Context,
    >(
    method : string,
    path : string[]|string,
    option : Omit<MethodPathArgumentsOption<ArgumentType, 'pathParameter', 'paths'>, 'storage'|'argument'>,
) : MethodPathReturn<ArgumentType, 'pathParameter', 'paths', ContextType>;

export function MethodPathParameters<
    ArgumentType extends Record<string, string>,
    Argument extends string = 'pathParameter',
    Storage extends string = 'paths',
    ContextType extends Context = Context,
    >(
    method : string,
    path : string[]|string,
    option : MethodPathArgumentsOption<ArgumentType, Argument, Storage>,
) : MethodPathReturn<ArgumentType,  Argument, Storage, ContextType>;

export function MethodPathParameters<
    ArgumentType extends Record<string, string>,
    Argument extends string,
    Storage extends string,
    ContextType extends Context,
    >(
    method : string,
    path : string[]|string,
    option : Partial<MethodPathArgumentsOption<ArgumentType, Argument|string, Storage|string>> = PathOptionDefault,
) : MethodPathReturn<ArgumentType, Argument|string, Storage|string, ContextType> {

    return Extends(Middleware(Method(method))
        .add(PathParameters(path, option))) as MethodPathReturn<ArgumentType, Argument|string, Storage|string, ContextType>;
}

export type MethodPathArgument<
    ArgumentType extends Record<string, string>,
    Argument extends string,
    Storage extends string,
> = PathArgument<ArgumentType, Argument, Storage> & {
    method : string,
};


export function MethodPathParameter<
    ArgumentType extends Record<string, string>,
    Argument extends string = 'pathParameter',
    ContextType extends Context = Context,
    >(
    argument : Omit<MethodPathArgument<ArgumentType, Argument, 'paths'>, 'storage'>,
) : PathReturn<ArgumentType, Argument, 'paths', ContextType>;

export function MethodPathParameter<
    ArgumentType extends Record<string, string>,
    ContextType extends Context = Context,
    >(
    argument : Omit<MethodPathArgument<ArgumentType, 'pathParameter', 'paths'>, 'storage'|'argument'>,
) : PathReturn<ArgumentType, 'pathParameter', 'paths', ContextType>;

export function MethodPathParameter<
    ArgumentType extends Record<string, string>,
    Argument extends string = 'pathParameter',
    Storage extends string = 'paths',
    ContextType extends Context = Context,
    >(
    argument : MethodPathArgument<ArgumentType, Argument, Storage>,
) : PathReturn<ArgumentType, Argument, Storage, ContextType>;

export function MethodPathParameter<
    ArgumentType extends Record<string, string>,
    Argument extends string,
    Storage extends string,
    ContextType extends Context,
    >(
    argument : MethodPathArgument<ArgumentType, Argument|string, Storage|string>,
) : PathReturn<ArgumentType, Argument|string, Storage|string, ContextType> {

    return MethodPathParameters(argument.method, argument.path, argument) as PathReturn<ArgumentType, Argument|string, Storage|string, ContextType>;
}

namespace Path {
    export const Parameters = MethodPathParameters;
    export const Parameter = MethodPathParameter;
    export type Argument<
        ArgumentType extends Record<string, string>,
        Argument extends string,
        Storage extends string
    > = MethodPathArgument<ArgumentType, Argument, Storage>;
}