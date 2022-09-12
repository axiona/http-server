import Context from "../context/context";
import Middleware, {MiddlewareReturn} from "./middleware";
import Metadata from "../router/metadata/metadata";
import {PathSegmentsGet} from "../context/path-segments";
import GetContextPath from "../router/metadata/get-context-path";
import Method from "../boolean/method";
import {SetResponseParameters} from "../context/set-response";
import {MethodNotAllowedParameters} from "../../../http/dist/response/method-not-allowed";
import {Request} from "koa";
import {Headers} from "headers-polyfill";
import {BadRequestParameters} from "../../../http/dist/response/bad-request";
import {UnsupportedMediaTypeParameters} from "../../../http/dist/response/unsupported-media-type";
import {ResponseParameters} from "../middleware/response";
import Stop from "./stop";



export default function StrictAccept<ContextType extends Context>(
    invalid: Middleware<ContextType> = Stop(ResponseParameters(UnsupportedMediaTypeParameters())) as Middleware<ContextType>
) : Middleware<ContextType> {

    let caches : Map<string, Pick<Metadata, 'headers'|'method'>> = new Map<string, Pick<Metadata, 'headers'|'method'>>();

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