import Middleware from './middleware';
import Context from '../context/context';
import Method from '../boolean/method';
import {PathSegmentsGet} from "../context/path-segments";
import {Headers} from "headers-polyfill";
import Metadata from "../router/metadata/metadata";
import GetContextPath from "../router/metadata/get-context-path";
// import MetadataCallback from "./metadata-callback";
import Next from "./next";

export default function AutoCors<
    ContextType extends Context = Context
>(
    // invalid : Middleware<ContextType, ContextType> = AutoOptionsDefault as Middleware<ContextType, ContextType>,
    // valid : Middleware<ContextType, ContextType> = Stop(),
     middleware : Middleware<ContextType, ContextType> = Next,
) : Middleware<ContextType, ContextType> {


  /*  return MetadataCallback((context, metadata) => {

        const header = new Headers(metadata.headers);

        const origin = context.request.get('Origin');

        const allowHeaders : string[] = [];

        if(header.has('Content-Type')) {
            allowHeaders.push('Content-Type');
        }

        const varies : string[] = ['Origin'];

        if(header.has('Accept-Encoding')) {
            varies.push('Accept-Encoding');
        }

        context.response.status = 204;
        context.body = undefined;
        context.set('Access-Control-Allow-Methods', metadata.method.join(', '));
        context.set('Access-Control-Allow-Origin', origin);
        context.set('Access-Control-Allow-Headers', allowHeaders);
        context.set('Vary', varies);
        context.set(metadata.headers);

    }, invalid, valid);*/


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

        const isOptions = Method(context, ['OPTIONS']);
        const isMethod = Method(context, methods.method);

        if(isOptions || isMethod) {

            const header = new Headers(methods.headers);

            const origin = context.request.get('Origin');

            const varies : string[] = ['Origin'];

            if(header.has('Accept-Encoding')) {
                varies.push('Accept-Encoding');
            }

            if(isOptions) {

                const allowHeaders : string[] = [];

                if(header.has('Content-Type')) {
                    allowHeaders.push('Content-Type');
                }

                context.response.status = 204;
                context.body = undefined;
                context.set('Access-Control-Allow-Methods', methods.method.join(', '));
                context.set('Access-Control-Allow-Origin', origin);
                context.set('Access-Control-Allow-Headers', allowHeaders);
                context.set('Vary', varies);
                context.set(methods.headers);

                // return /*valid*/(context);
            } else if(isMethod) {

                context.set('Access-Control-Allow-Origin', origin);
                context.set('Vary', varies);
                // return context;
            }

            return middleware(context);
        }

        return /*invalid*/(context);

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
