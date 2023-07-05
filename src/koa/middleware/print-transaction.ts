import Context from '../../context/context.js';
import Syslog from '@alirya/syslog/syslog.js';
import Callable from '@alirya/function/callable.js';
import {Middleware as KoaMiddleware, Request, Response} from "koa";
import ResponseEnd from "../../http/reponse/promise/response-end.js";
import SyslogTransaction from "../../callable/syslog-transaction.js";

/**
 * Print transaction parameters
 */
export function PrintTransactionParameters<
    Arguments extends unknown[],
    ContextType extends Context,
    Log extends Syslog<Arguments>
>(
    syslog: Log,
    transaction : Callable<[Request, Response], Arguments>,
    severity : keyof Syslog = 'debug',
) : KoaMiddleware {

    const callback = SyslogTransaction(syslog, transaction, severity);

    return function (context, next) {

        ResponseEnd(context.res).then(()=>{

            callback(context.request, context.response);

        }).catch(error => console.error(error));

        return next();
    };
}

/**
 * Print transaction parameter
 */
export function PrintTransactionParameter<
    Arguments extends unknown[],
    ContextType extends Context,
    Log extends Syslog<Arguments>
>(
    {
        syslog,
        severity = 'debug',
        transaction,
    } : {
        syslog : Log,
        severity ?: keyof Syslog ,
        transaction : Callable<[Request, Response], Arguments>,
    }
) : KoaMiddleware {
    return PrintTransactionParameters(syslog, transaction, severity);
}

namespace PrintTransaction {
    export const Parameters = PrintTransactionParameters;
    export const Parameter = PrintTransactionParameter;
}

export default PrintTransaction;
