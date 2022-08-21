import Context from '../context/context';
import Middleware from './middleware';
import {ListParameter, ListType} from '@alirya/uri/path/list';
import { match as Matcher, MatchFunction, ParseOptions, TokensToRegexpOptions, RegexpToFunctionOptions} from 'path-to-regexp';
import Parents from '../router/array/parents';
import Router from '../router/router';
import IsPath from './boolean/path';
import ContextPath from "../path-to-regexp/match/context-path";
import {Required} from "utility-types";

export type PathReturn<
    ArgumentType extends Record<string, string> = Record<string, string>,
    Argument extends string = string,
    Storage extends string = string,
    ContextType extends Context = Context,
> =  Middleware<
    ContextType,
    ContextType & {
        request : {
            [Key in Storage] : ListType
        } & {
            [Key in Argument] : ArgumentType
        }
    }
> & PathContainerType<ArgumentType, Argument, Storage>;

export type PathArgumentsOption<
    ArgumentType extends Record<string, string>,
    Argument extends string,
    Storage extends string,
> = ParseOptions & TokensToRegexpOptions & RegexpToFunctionOptions & {

    storage : Storage;
    argument : Argument;
};

export const PathOptionDefault : PathArgumentsOption<Record<string, string>, 'pathParameter', 'paths'> = Object.freeze({
    argument : 'pathParameter',
    storage : 'paths',
});

export interface PathContainerType<
    ArgumentType extends Record<string, string>,
    Argument extends string,
    Storage extends string
> {

    paths : ListType;
    matchers : Map<Router, PathMatchers>;
    path : string;
    option : PathArgumentsOption<ArgumentType, Argument, Storage>;
}

export function PathParameters<
    ArgumentType extends Record<string, string>,
    ContextType extends Context = Context,
>(
    paths : string[]|string,
) : PathReturn<ArgumentType, 'pathParameter', 'paths', ContextType>;

export function PathParameters<
    ArgumentType extends Record<string, string>,
    Argument extends string = 'pathParameter',
    ContextType extends Context = Context,
>(
    paths : string[]|string,
    option : Omit<PathArgumentsOption<ArgumentType, Argument, 'paths'>, 'storage'>,
) : PathReturn<ArgumentType, Argument, 'paths', ContextType>;

export function PathParameters<
    ArgumentType extends Record<string, string>,
    ContextType extends Context = Context,
    >(
    paths : string[]|string,
    option : Omit<PathArgumentsOption<ArgumentType, 'pathParameter', 'paths'>, 'storage'|'argument'>,
) : PathReturn<ArgumentType, 'pathParameter', 'paths', ContextType>;

export function PathParameters<
    ArgumentType extends Record<string, string>,
    Argument extends string = 'pathParameter',
    Storage extends string = 'paths',
    ContextType extends Context = Context,
>(
    paths : string[]|string,
    option : PathArgumentsOption<ArgumentType, Argument, Storage>,
) : PathReturn<ArgumentType, Argument, Storage, ContextType>;

export function PathParameters<
    ArgumentType extends Record<string, string>,
    Argument extends string,
    Storage extends string,
    ContextType extends Context,
>(
    paths : string[]|string,
    option : Partial<PathArgumentsOption<ArgumentType, Argument|string, Storage|string>> = PathOptionDefault,
) : PathReturn<ArgumentType, Argument|string, Storage|string, ContextType> {

    option = Object.assign({}, PathOptionDefault, option);

    const relatives = PathGenerateList(paths);

    const matchers : Map<Router, PathMatchers> = new Map();

    const register = function (router : Router) {

        PathRegister(relatives, matchers, option as PathArgumentsOption<ArgumentType, Argument, Storage>, router);
    };

    const callback = function (context : Context) {

        return PathMatch(matchers, option as PathArgumentsOption<ArgumentType, Argument, Storage>, context);
    };


    return Object.assign(callback, {
        option,
        register,
        matchers,
        paths: relatives,
        path: relatives.toString(),
    }) as PathReturn<ArgumentType, Argument|string, Storage|string, ContextType>;
}

export function PathGenerateList(paths : string[]|string) : ListType {

    return ListParameter({
        segments : paths,
        empty : false,
        separators : '/\\',
        prefix: true
    });
}


export function PathParents(parents: ReadonlyArray<Required<Router, 'middleware'>>) : string[] {

    const parentPaths : string[] = [];

    for (const parent of parents) {

        const middleware : PathReturn|Middleware = parent.middleware as Middleware;

        if(IsPath(middleware)) {

            const paths = (middleware as PathReturn).paths;

            if(Array.isArray(paths)) {

                parentPaths.unshift(...paths);
            }
        }
    }

    return parentPaths;
}

export type PathMatchers = {
    callback : MatchFunction,
    path : string
};



export function PathRegister<
    ArgumentType extends Record<string, string>,
    Argument extends string,
    Storage extends string
>(
    paths : ListType,
    container: Map<Router, PathMatchers>,
    option : PathArgumentsOption<ArgumentType, Argument, Storage>,
    router : Router
) {

    const parent = Parents(router).filter(parent=>parent.middleware);
    const parentPaths = PathParents(parent);

    const absolute = PathGenerateList([...parentPaths, ...paths]);
    const absoluteString = absolute.toString();

    container.set(router, {
        callback : Matcher(absoluteString, option),
        path : absoluteString
    });
}

/**
 * match path from {@param context} with pre-defined matcher inside {@param container}
 *
 * @param container
 * @param option
 * @param context
 * @constructor
 */
export function PathMatch<
    ArgumentType extends Record<string, string>,
    Argument extends string,
    Storage extends string
> (
    container: Map<Router, PathMatchers>,
    option : PathArgumentsOption<ArgumentType, Argument, Storage>,
    context : Context
) : Context|undefined {

    const match = container.get(context.router);

    if(!match) {

        throw new Error('Matcher on current route is not exists');
    }

    const result = ContextPath(match, context);

    if(result) {

        Object.assign(context.request, {
            [option.argument] : result.params
        });

        return context;
    }

}



export type PathArgument<
    ArgumentType extends Record<string, string>,
    Argument extends string,
    Storage extends string,
> = PathArgumentsOption<
    ArgumentType,
    Argument,
    Storage
> & {
    path : string[]|string
};

export function PathParameter<
    ArgumentType extends Record<string, string>,
    Argument extends string,
    ContextType extends Context,
>(
    argument : Omit<PathArgument<ArgumentType, Argument, 'paths'>, 'storage'>,
) : PathReturn<ArgumentType, Argument, 'paths', ContextType>;

export function PathParameter<
    ArgumentType extends Record<string, string>,
    Argument extends string,
    Storage extends string,
    ContextType extends Context,
>(
    argument : Omit<PathArgument<ArgumentType, 'pathParameter', 'paths'>, 'storage'|'argument'>,
) : PathReturn<ArgumentType, 'pathParameter', 'paths', ContextType>;

export function PathParameter<
    ArgumentType extends Record<string, string>,
    Argument extends string,
    Storage extends string,
    ContextType extends Context,
>(
    argument : PathArgument<ArgumentType, Argument, Storage>,
) : PathReturn<ArgumentType, Argument, Storage, ContextType>;

export function PathParameter<
    ArgumentType extends Record<string, string>,
    Argument extends string,
    Storage extends string,
    ContextType extends Context,
>(
    argument : PathArgument<ArgumentType, Argument|string, Storage|string>,
) : PathReturn<ArgumentType, Argument|string, Storage|string, ContextType> {

    return PathParameters(argument.path, argument) as PathReturn<ArgumentType, Argument|string, Storage|string, ContextType>;
}

namespace Path {
    export const Parameters = PathParameters;
    export const Parameter = PathParameter;
    export type Argument<
        ArgumentType extends Record<string, string>,
        Argument extends string,
        Storage extends string
        > = PathArgument<ArgumentType, Argument, Storage>;
}