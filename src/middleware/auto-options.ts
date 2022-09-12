import Middleware from './middleware';
import Context from '../context/context';
import Root from '../router/root';
import Method from '../boolean/method';
import FromResponse, {SetResponseParameters} from '../context/set-response';
import {MethodNotAllowedParameters} from '@alirya/http/response/method-not-allowed';
import ContextPath from "../matcher/match/context-path";
import FromRouter from "../router/metadata/array/from-router";
import Stop from "./stop";
import {PathSegmentsGet} from "../context/path-segments";
import {UniqueParameters} from '@alirya/array/unique';
import Standard from "../router/standard";
import {Headers} from "headers-polyfill";
import Metadata from "../router/metadata/metadata";
import GetContextPath from "../router/metadata/get-context-path";

export default function AutoOptions<
    ContextType extends Context = Context
>(
    // invalid : Middleware<ContextType, ContextType> = AutoOptionsDefault as Middleware<ContextType, ContextType>,
    // valid : Middleware<ContextType, ContextType> = Stop(),
) : Middleware<ContextType, ContextType> {

    let caches : Map<string, Pick<Metadata, 'headers'|'method'>> = new Map<string, Pick<Metadata, 'headers'|'method'>>();

    return function (context) {

        const path = PathSegmentsGet(context).toString();

        if(!caches.has(path)) {

            caches.set(path, GetContextPath(context));
        }

        const methods = caches.get(path) as Pick<Metadata, 'headers'|'method'>;

        if(!methods.method.length) {

            return ;
        }

        if(Method(context, ['OPTIONS'])) {

            context.response.status = 204;
            context.body = undefined;
            context.set('Allow', methods.method.join(', '));
            context.set(methods.headers);

            return context;
            // return valid(context);
        }

        if(Method(context, methods.method)) {

            return context;
        }

        return SetResponseParameters(context, MethodNotAllowedParameters(), true) as ContextType;
        // return invalid(context);

    };

}

// export function AutoOptionsDefault<ContextType extends Context>(context : ContextType) {
//
//     return FromResponse.Parameters(context, MethodNotAllowedParameters());
// }

// export function AutoOptionGenerateMethods(context : Context) : Pick<Metadata, 'headers'|'method'> {
//
//     const metadatas = FromRouter(Root(context.router || new Standard()))
//         .filter(metadata=>ContextPath(metadata.path, context));
//
//     let methods = metadatas
//         .flatMap(metadata=>metadata.method)
//         .map(method=>method.toUpperCase());
//
//     methods = UniqueParameters(methods);
//
//     const header = new Headers();
//
//     for (const metadata of metadatas) {
//
//         for(const [name, value] of Object.entries(metadata.headers)) {
//
//             header.append(name, value);
//         }
//     }
//
//     return {method:methods, headers: header.all()};
// }
