import Middleware from './middleware.js';
import Context from '../context/context.js';
import Router from '../router/router.js';
import Path from './boolean/path.js';
import IsMethod from './boolean/method.js';
import {PathMatchers, PathMatches} from './path.js';
import Root from '../router/root.js';
import Method from '../boolean/method.js';
import FromResponse from '../context/from-response.js';
import {MethodNotAllowedParameters} from '@alirya/http/response/method-not-allowed.js';

export default function AutoOptions<
    ContextType extends Context = Context
>(
    disallow : Middleware = AutoOptionsDefault
) : Middleware<ContextType, ContextType> {

    return function (context) {

        for (const [path, value] of AutoOptionRoot(context.router)) {

            const result = PathMatches({path, callback : value.matcher.callback}, context);

            if(result) {

                const methods = Array.from(value.methods);

                if(Method(context, ['OPTIONS'])) {

                    context.response.status = 200;
                    context.body = undefined;
                    context.set('Allow', methods.join(', '));

                    return ;
                }

                if(Method(context, methods)) {

                    return context;
                }

                disallow(context);
            }

        }

        return context;
    };

}

export function AutoOptionsDefault<ContextType extends Context>(context : ContextType) {

    return FromResponse.Parameters(context, MethodNotAllowedParameters());
}

export type AutoOption = {
    methods : Set<string>,
    matcher ?:PathMatchers
};

export function AutoOptionClone(option : AutoOption) : AutoOption {

    return {
        matcher : option.matcher,
        methods : new Set(option.methods)
    };
}

export const AutoOptionRootKey = Symbol('AutoOptionRoot');

export function AutoOptionRoot(context : Router) : Map<string, Required<AutoOption>> {

    const parent = Root(context);

    if(!parent[AutoOptionRootKey]) {

        const lists = AutoOptionGenerateRouter(parent, {methods:new Set()});

        const mapped = new Map<string, Required<AutoOption>>();

        for (const list of lists) {

            let data = mapped.get(list.matcher.path);

            if(!data) {

                mapped.set(list.matcher.path, list);
                data = list;
            }

            list.methods.forEach(v => (data as AutoOption).methods.add(v));

        }

        parent[AutoOptionRootKey] = mapped;

    }

    return parent[AutoOptionRootKey];
}

export function AutoOptionGenerateRouter(
    router : Router,
    option : AutoOption,
) : Required<AutoOption>[] {

    const result : AutoOption[] = [];

    const middleware = router.middleware;

    option = AutoOptionClone(option);

    if(middleware) {

        result.push(
            ...AutoOptionGenerateMiddleware(router, middleware, option)
        );

    }

    for (const children of router.children) {

        result.push(
            ...AutoOptionGenerateRouter(children, option)
        );
    }

    return result as Required<AutoOption>[];

}

export function AutoOptionGenerateMiddleware(
    router : Router,
    middleware : Middleware,
    option : AutoOption,
) : AutoOption[] {

    const result : AutoOption[] = [];

    if(IsMethod(middleware)) {

        middleware.methods.forEach(v=>option.methods.add(v));


    } else if(Path(middleware)) {

        option.matcher = middleware.matchers.get(router);

    }

    if(option.matcher && option.methods.size) {

        result.push(option);
    }

    return result;
}
