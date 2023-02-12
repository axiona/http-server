import Middleware from './middleware.js';
import Context from '../context/context.js';
import Method from '../boolean/method.js';
import {PathSegmentsGet} from '../context/path-segments.js';
import {Headers} from "headers-polyfill";
import Metadata from '../router/metadata/metadata.js';
import GetContextPath from '../router/metadata/get-context-path.js';

export default function AutoCors<
    ContextType extends Context = Context
>(

) : Middleware<ContextType, ContextType> {

    const caches : Map<string, Pick<Metadata, 'headers'|'method'>> = new Map<string, Pick<Metadata, 'headers'|'method'>>();

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

            } else if(isMethod) {

                context.set('Access-Control-Allow-Origin', origin);
                context.set('Vary', varies);
            }
        }

        return context;

    };

}

