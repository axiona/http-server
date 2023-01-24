import Middleware from './middleware';
import Context from '../context/context';
import Method from '../boolean/method';
import {SetResponseParameters} from '../context/set-response';
import {MethodNotAllowedParameters} from '@alirya/http/response/method-not-allowed';
import {PathSegmentsGet} from "../context/path-segments";
import Metadata from "../router/metadata/metadata";
import GetContextPath from "../router/metadata/get-context-path";

export default function AutoOptions<
    ContextType extends Context = Context
>() : Middleware<ContextType, ContextType> {

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
        }

        if(Method(context, methods.method)) {

            return context;
        }

        return SetResponseParameters(context, MethodNotAllowedParameters(), true) as ContextType;

    };

}
