import {InternalServerErrorParameter} from '@alirya/http/response/internal-server-error';
import Name from '@alirya/object/string/name';
import ContentTypeTextUtf8 from '@alirya/http/headers/header/content-type-text-utf8';
import {FromResponseParameters} from "../context/from-response";
import Context from "../context/context";

/**
 * print out error to response
 *
 * @param error
 * @param context
 * @constructor
 */
export default function Debug<
    Error  extends globalThis.Error,
    ContextType extends Context
>(
    error : Error,
    context: ContextType
) {

    FromResponseParameters(context, InternalServerErrorParameter({
        headers : ContentTypeTextUtf8,
        body : [Name(error), error.message, error.stack].join('\n')
    }));

}
