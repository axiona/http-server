import Context from '../context/context.js';
import Middleware from './middleware.js';
import Metadata from '../router/metadata/metadata.js';
import {PathSegmentsGet} from '../context/path-segments.js';
import GetContextPath from '../router/metadata/get-context-path.js';
import {Request} from "koa";
import {Headers} from "headers-polyfill";
import {UnsupportedMediaTypeParameters} from '@alirya/http/response/unsupported-media-type.js';
import {ResponseParameters} from '../middleware/response.js';
import Stop from './stop.js';



export default function ValidateAccept<ContextType extends Context>(
    invalid: Middleware<ContextType> = Stop(ResponseParameters(UnsupportedMediaTypeParameters())) as Middleware<ContextType>
) : Middleware<ContextType> {

    const caches : Map<string, Pick<Metadata, 'headers'|'method'>> = new Map<string, Pick<Metadata, 'headers'|'method'>>();

    return function (context) {

        if((context.request as Request & { body ?: unknown }).body !== undefined) {

            return context;
        }

        const path = PathSegmentsGet(context).toString();

        if(!caches.has(path)) {

            caches.set(path, GetContextPath(context));
        }

        const methods = caches.get(path) as Pick<Metadata, 'headers'|'method'>;

        const header = new Headers(methods.headers);

        const accept = header.get('Accept');

        const type = context.header['content-type'];

        if(accept && type) {

            const accepts = new Set(accept.split(',').map(val=>val.trim()).map(val=>{

                return val.split(';', 2)[0].trim();
            }));

            for (const mime of accepts) {

                if(mime === type || mime.toLowerCase() === type.toLowerCase()) {

                    return context;
                }
            }
        }

        return invalid(context);

    };


}