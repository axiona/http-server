import Context from '../context/context';
import Syslog from '@alirya/syslog/syslog';
import Middleware from './middleware';
import Callable from '@alirya/function/callable';
import {Request, Response} from "koa";
import TransactionMessages from "../array/transaction-messages";
import RequestMessages from "../array/request-messages";
import ResponseMessages from "../array/response-messages";

export function PrintTransactionParameters<ContextType extends Context<Partial<{ body: any }>>, Log extends Syslog<any[]>>(
    syslog: Log,
    severity : keyof Syslog = 'debug',
    transaction : Callable<[Request, Response], any[]> = TransactionMessages,
    request : Callable<[Request], any[]> = RequestMessages,
    response : Callable<[Response], any[]> = ResponseMessages,
) : Middleware<ContextType> {

    return function (context) {

        const responseClose = new Promise<void>((resolve, reject) => {
            context.res.on('close', resolve);
        });

        const responseFinish = new Promise<void>((resolve, reject) => {
            context.res.on('finish', resolve);
        });

        Promise.race([responseFinish, responseClose]).then(()=>{

            const messages = [
                ...transaction(context.request, context.response),
                ...request(context.request),
                ...response(context.response),
            ];

            syslog[severity](...messages);

        }).catch(console.error);

        return context;
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
