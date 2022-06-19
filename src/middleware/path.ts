import Context from '../context/context';
import Middleware from './middleware';
import List, {ListParameterType} from '@alirya/uri/path/list-parameter';
import { match as Matcher, Match, MatchFunction, ParseOptions, TokensToRegexpOptions, RegexpToFunctionOptions} from 'path-to-regexp';
import Parents from '../router/array/parents';
import Router from '../router/router';
import IsPath from './boolean/path';
import {Required} from 'utility-types';
import ContextPathSegments, {PathSegmentsKey} from '../context/path-segments';

export type PathReturn<
    ContextType extends Context = Context,
    Argument extends string = string,
    Storage extends string = string,
> =  Middleware<
    ContextType,
    ContextType & {
        request : {
            [Key in Storage] : ListParameterType
        } & {
            [Key in Argument] : Record<string, string>
        }
    }
> & PathContainerType<Argument, Storage>;

export type PathOption<
    Argument extends string,
    Storage extends string,
> = ParseOptions & TokensToRegexpOptions & RegexpToFunctionOptions & {

    storage : Storage;
    argument : Argument;
};

export const PathOptionDefault : PathOption<'pathParameter', 'paths'> = Object.freeze({
    argument : 'pathParameter',
    storage : 'paths',
});

export interface PathContainerType<Argument extends string, Storage extends string> {

    paths : ListParameterType;
    matchers : Map<Router, PathMatchers>;
    path : string;
    option : PathOption<Argument, Storage>;
}

export default function Path<
    ContextType extends Context,
    Argument extends string,
>(
    paths : string[]|string,
) : PathReturn<ContextType, Argument, 'paths'>;

export default function Path<
    ContextType extends Context,
    Argument extends string,
>(
    paths : string[]|string,
    option : Omit<PathOption<Argument, 'paths'>, 'storage'>,
) : PathReturn<ContextType, Argument, 'paths'>;

export default function Path<
    ContextType extends Context,
    Argument extends string,
    Storage extends string,
    >(
    paths : string[]|string,
    option : Omit<PathOption<'pathParameter', 'paths'>, 'storage'|'argument'>,
) : PathReturn<ContextType, 'pathParameter', 'paths'>;

export default function Path<
    ContextType extends Context,
    Argument extends string,
    Storage extends string,
>(
    paths : string[]|string,
    option : PathOption<Argument, Storage>,
) : PathReturn<ContextType, Argument, Storage>;

export default function Path<
    ContextType extends Context,
    Argument extends string,
    Storage extends string,
>(
    paths : string[]|string,
    option : Partial<PathOption<Argument|string, Storage|string>> = PathOptionDefault,
) : PathReturn<ContextType, Argument|string, Storage|string> {


    option = Object.assign({}, PathOptionDefault, option);

    const relatives = PathGenerateList(paths);

    const matchers : Map<Router, PathMatchers> = new Map();

    const register = function (router : Router) {

        PathRegister(relatives, matchers, option as PathOption<Argument, Storage>, router);
    };

    const callback = function (context : Context) {

        return PathMatch(matchers, option as PathOption<Argument, Storage>, context);
    };


    return Object.assign(callback, {
        option,
        register,
        matchers,
        paths: relatives,
        path: relatives.toString(),
    }) as PathReturn<ContextType, Argument|string, Storage|string>;
}

export const PathMatched = Symbol('PathMatch');

/**
 *
 *
 * @param match
 * @param context
 */
export function PathMatches<Argument extends string, Storage extends string>(
    match : PathMatchers,
    context : Context
) : Match|false  {

    if(!context.request[PathMatched]) {

        context.request[PathMatched] = new Map<string, Match|false>();
    }

    const cached : Map<string, Match|false> = context.request[PathMatched];

    let paths : ListParameterType = ContextPathSegments(context).request[PathSegmentsKey];
    let path = paths.toString();

    if(cached.has(match.path)) {

        return cached.get(match.path) as Match;

    } else {

        const result = match.callback(path);

        cached.set(match.path, result);

        return result;
    }
}


export function PathGenerateList(paths : string[]|string) : ListParameterType {

    return List({
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
    Argument extends string,
    Storage extends string
>(
    paths : ListParameterType,
    container: Map<Router, PathMatchers>,
    option : PathOption<Argument, Storage>,
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

export function PathMatch<
    Argument extends string,
    Storage extends string
> (
    container: Map<Router, PathMatchers>,
    option : PathOption<Argument, Storage>,
    context : Context
) {

    const match = container.get(context.router);

    if(!match) {

        throw new Error('Matcher on current route is not exists');
    }

    const result = PathMatches(match, context);

    if(result) {

        Object.assign(context.request, {
            [option.argument] : result.params
        });

        return context;
    }

}
