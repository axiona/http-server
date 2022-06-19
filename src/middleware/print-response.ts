import Context from '../context/context';
import Syslog from '@alirya/syslog/syslog';
import Middleware from './middleware';

export function PrintResponseParameters<ContextType extends Context, Log extends Syslog<[string, any, any]>>(
    syslog: Log,
    severity : keyof Syslog = 'debug',
) : Middleware<ContextType> {

    return function (context) {

        syslog[severity](
            `${context.response.status} ${context.response.message}`,
            context.response.headers,
            context.response.body
        );
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
