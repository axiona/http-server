import Middleware from './middleware';
import Context from '../context/context';
import Syslog from '@alirya/syslog/syslog';

export function PrintRequestParameters<ContextType extends Context, Log extends Syslog<[string, any, any]>>(
    syslog: Log,
    severity : keyof Syslog = 'debug',
) : Middleware<ContextType> {

    return function (context) {

        syslog[severity](
            `${context.request.method} ${context.request.path}`,
            context.request.headers,
            (<any>context.request).body
        );
    };
}

export function PrintRequestParameter<ContextType extends Context, Log extends Syslog<[string, any, any]>>(
    {
        syslog,
        severity = 'debug',
    } : {
        syslog : Log,
        severity ?: keyof Syslog ,
    }
) {
    return PrintRequestParameters(syslog, severity);
}

namespace PrintRequest {
    export const Parameters = PrintRequestParameters;
    export const Parameter = PrintRequestParameter;
}

export default PrintRequest;
