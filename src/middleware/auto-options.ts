import Middleware from './middleware.js';
import Context from '../context/context.js';
import Method from '../boolean/method.js';
import {SetResponseParameters} from '../context/set-response.js';
import {MethodNotAllowedParameters} from '@axiona/http/response/method-not-allowed.js';
import {PathSegmentsGet} from '../context/path-segments.js';
import Metadata from '../router/metadata/metadata.js';
import GetContextPath from '../router/metadata/get-context-path.js';

export default function AutoOptions<
    ContextType extends Context = Context
>() : Middleware<ContextType, ContextType> {

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

        if(Method(context, ['OPTIONS'])) {

            context.response.status = 204;
            context.body = undefined;
            context.set('Allow', methods.method.join(', '));
            context.set(methods.headers);

            return context;
        }

        if(Method(context, methods.method)) {

            return context;
        }

        return SetResponseParameters(context, MethodNotAllowedParameters(), true) as ContextType;

    };

}
