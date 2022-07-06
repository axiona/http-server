import {PickParameters} from '@alirya/object/pick.js';
import Context from '../context/context.js';
import Syslog from '@alirya/syslog/syslog.js';
import Middleware from './middleware.js';

export function PrintTransactionParameters<ContextType extends Context<Partial<{ body: any }>>, Log extends Syslog<[string, any, any]>>(
    syslog: Log,
    severity : keyof Syslog = 'debug',
) : Middleware<ContextType> {

    return function (context) {

        syslog[severity](
          `${context.request.method} ${context.request.path} -> ${context.response.status} ${context.response.message}`,
          PickParameters(context.request, 'headers', 'body'),
          PickParameters(context.response, 'headers', 'body'),
        );
    };
}


export function PrintTransactionParameter<ContextType extends Context, Log extends Syslog<[string, any, any]>>(
    {
        syslog,
        severity = 'debug',
    } : {
        syslog : Log,
        severity ?: keyof Syslog ,
    }
) {
    return PrintTransactionParameters(syslog, severity);
}

namespace PrintTransaction {
    export const Parameters = PrintTransactionParameters;
    export const Parameter = PrintTransactionParameter;
}

export default PrintTransaction;
