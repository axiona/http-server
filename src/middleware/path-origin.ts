import Context from '../context/context';
import Middleware from './middleware';
import List, {ListParameterType} from '@alirya/uri/path/list-parameter';
import EqualParameters from '@alirya/array/boolean/equal-parameters';
import Callable from '../../../function/dist/callable';
import { pathToRegexp, match as Matcher, Match, parse, compile, MatchFunction, ParseOptions, TokensToRegexpOptions, RegexpToFunctionOptions, MatchResult } from 'path-to-regexp';
import ExistsParameters from '../../../object/dist/property/boolean/exists-parameters';
import Parents from '../router/array/parents';
import Router from '../router/router';
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

    const container = new PathContainer(paths, option as PathOption<Argument|string, Storage|string>);

    return Object.assign(
        (context)=>container.call(context),
        {
            register : (router) => container.register(router),
            paths : container.paths,
            path : container.path,
            matchers : container.matchers,
            option : container.option,
        }
    ) as PathReturn<ContextType, Argument|string, Storage|string>;
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

        if(ExistsParameters(middleware, 'path')) {

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

export interface PathContainerType<Argument extends string, Storage extends string> {

    paths : ListParameterType;
    matchers : Map<Router, PathMatchers>;
    path : string;
    option : PathOption<Argument, Storage>;
}

export class PathContainer<
    ContextType extends Context,
    Argument extends string,
    Storage extends string,
> implements PathContainerType<Argument, Storage> {

    paths : ListParameterType;
    path : string;
    matchers : Map<Router, PathMatchers> = new Map();

    constructor(
        paths : string[]|string,
        readonly option : PathOption<Argument, Storage>,
    ) {

        this.paths = PathGenerateList(paths);
        this.path = this.paths.toString();
    }

    register(router : Router) {

        const parentPaths = PathParents(
            Parents(router).filter(parent=>parent.middleware)
        );

        const relatives = PathGenerateList([...parentPaths, ...this.paths]);
        const relativePath = relatives.toString();

        this.matchers.set(router, {
            callback : Matcher(relativePath.toString(), this.option),
            path : relativePath.toString()
        });
    }


    call (context : Context) {

        const match = this.matchers.get(context.router);

        if(!match) {

            throw new Error('Matcher on current route is not exists');
        }

        const result = PathMatches(match, context);

        if(result) {

            Object.assign(context.request, {
                [this.option.argument] : result.params
            });

            return context;
        }

    }
}

