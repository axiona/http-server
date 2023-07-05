import Context from '../context/context.js';
import Syslog from '@alirya/syslog/syslog.js';
import Middleware from './middleware.js';
import Callable from '@alirya/function/callable.js';
import {Request, Response} from "koa";
import SyslogTransaction from "../callable/syslog-transaction.js";

export function LogTransactionParameters<
    Arguments extends unknown[],
    ContextType extends Context,
    Log extends Syslog<Arguments>
>(
    syslog: Log,
    transaction : Callable<[Request, Response], Arguments>,
    severity : keyof Syslog = 'debug',
) : Middleware<ContextType> {

    const callback = SyslogTransaction(syslog, transaction, severity);

    return function (context) {

        callback(context.request, context.response);

        return context;
    };
}


export function LogTransactionParameter<
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
) {
    return LogTransactionParameters(syslog, transaction, severity);
}

namespace LogTransaction {
    export const Parameters = LogTransactionParameters;
    export const Parameter = LogTransactionParameter;
}

export default LogTransaction;
