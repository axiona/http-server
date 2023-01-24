import Context from '../context/context';
import Middleware from './middleware';
import {ListType} from '@alirya/uri/path/list';
import { ParseOptions, TokensToRegexpOptions, RegexpToFunctionOptions} from 'path-to-regexp';
import ContextPath from "../matcher/match/context-path";
import Matcher from "../matcher/matcher";
import List from "../path/list/list";
import Metadata from "../router/metadata/metadata";
import FromPath from "../matcher/from-path";
import Null from "../router/metadata/null";

export type PathContext<
    ArgumentType extends Record<string, string> = Record<string, string>,
    Argument extends string = 'pathParameter',
    Storage extends string = 'paths',
    ContextType extends Context = Context> = ContextType & {
    request : {
        [Key in Storage] : ListType
    } & {
        [Key in Argument] : ArgumentType
    }
};


export type PathReturn<
    ArgumentType extends Record<string, string> = Record<string, string>,
    Argument extends string = string,
    Storage extends string = string,
    ContextType extends Context = Context,
> =  Middleware<
    ContextType,
    PathContext<ArgumentType, Argument, Storage, ContextType>
>;

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

    const metadatas = new Map<string, Matcher>();

    option = Object.assign({}, PathOptionDefault, option);
    let relatives = List(paths);

    const createMatcher = (metadata : Metadata) : Matcher => {

        const absolute = List([metadata.path.path, ...relatives]);

        return FromPath(absolute.toString(), option);
    };

    const register = (metadata : Metadata) => {

        let matcher = createMatcher(metadata);
        metadata.path = matcher;

        metadatas.set(matcher.path, matcher);
        return metadata;
    };

    return Object.assign((context: Context) => {

        let match: Matcher;

        if(context.router) {

            match = metadatas.get(context.router.path.path) as Matcher;

            if(!match) {

                throw new Error('Matcher on current route is not exists');
            }

        } else {

            match = createMatcher(Null());
        }

        const result = ContextPath(match, context);

        if(result) {

            Object.assign(context.request, {
                [option.argument as Argument]: result.params
            });

            return context;
        }

    }, {register}) as PathReturn<ArgumentType, Argument|string, Storage|string, ContextType>;
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