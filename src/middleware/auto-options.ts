import Middleware from './middleware';
import Context from '../context/context';
import Root from '../router/root';
import Method from '../boolean/method';
import FromResponse from '../context/from-response';
import {MethodNotAllowedParameters} from '@alirya/http/response/method-not-allowed';
import ContextPath from "../matcher/match/context-path";
import FromRouter from "../router/metadata/array/from-router";
import Stop from "./stop";
import {PathSegmentsGet} from "../context/path-segments";
import {UniqueParameters} from '@alirya/array/unique';

export default function AutoOptions<
    ContextType extends Context = Context
>(
    invalid : Middleware<ContextType, ContextType> = AutoOptionsDefault as Middleware<ContextType, ContextType>,
    valid : Middleware<ContextType, ContextType> = Stop as Middleware<ContextType, ContextType>,
) : Middleware<ContextType, ContextType> {

    let caches : Map<string, string[]> = new Map<string, string[]>();

    return function (context) {

        const path = PathSegmentsGet(context).toString();

        if(!caches.has(path)) {

            caches.set(path, AutoOptionGenerateMethods(context));
        }

        const methods = caches.get(path) as string[];

        if(!methods.length) {

            return ;
        }

        if(Method(context, ['OPTIONS'])) {

            context.response.status = 200;
            context.body = undefined;
            context.set('Allow', methods.join(', '));

            return valid(context);

        }

        if(Method(context, methods)) {

            return context;
        }

        return invalid(context);

    };

}

export function AutoOptionsDefault<ContextType extends Context>(context : ContextType) {

    return FromResponse.Parameters(context, MethodNotAllowedParameters());
}

export function AutoOptionGenerateMethods(context : Context) : string[] {

    const methods = FromRouter(Root(context.router))
        .filter(metadata=>ContextPath(metadata.path, context))
        .flatMap(metadata=>metadata.method)
        .map(method=>method.toUpperCase());

    return UniqueParameters(methods);
}
