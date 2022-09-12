import Context from '../context/context';
import Syslog from '@alirya/syslog/syslog';
import Middleware from './middleware';
import Callable from '@alirya/function/callable';
import {Response} from "koa";
import ResponseMessages from "../array/response-messages";

export function PrintResponseParameters<ContextType extends Context, Log extends Syslog<any[]>>(
    syslog: Log,
    severity : keyof Syslog = 'debug',
    response : Callable<[Response], any[]> = (response) => ResponseMessages(response, null, true),
) : Middleware<ContextType> {

    return function (context) {

        syslog[severity](...response(context.response));
    };
}

export function PrintResponseParameter<ContextType extends Context, Log extends Syslog<[string, any, any]>>(
    {
        syslog,
        severity = 'debug',
    } : {
        syslog : Log,
        severity ?: keyof Syslog ,
    }
) {
    return PrintResponseParameters(syslog, severity);
}

namespace PrintResponse {
    export const Parameters = PrintResponseParameters;
    export const Parameter = PrintResponseParameter;
}

export default PrintResponse;
