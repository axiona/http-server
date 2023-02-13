import Context from '../context/context';
import Syslog from '@alirya/syslog/syslog';
import Middleware from './middleware';
import Callable from '@alirya/function/callable';
import {Request, Response} from "koa";
import TransactionMessages from "../array/transaction-messages";
import RequestMessages from "../array/request-messages";
import ResponseMessages from "../array/response-messages";
import ResponseEnd from "../promise/response-end";
import Successful from '@alirya/http/response/status/class/boolean/successful';

export function PrintAutoVerboseParameters<ContextType extends Context<Partial<{ body: any }>>, Log extends Syslog<any[]>>(
    syslog: Log,
    severity : keyof Syslog = 'debug',
    transaction : Callable<[Request, Response], any[]> = TransactionMessages,
    request : Callable<[Request], any[]> = RequestMessages,
    response : Callable<[Response], any[]> = ResponseMessages,
) : Middleware<ContextType> {

    return function (context) {

        ResponseEnd(context.res).then(()=>{

            const messages = transaction(context.request, context.response);

            if(!Successful(context.response.status)) {

                messages.push(...request(context.request));
                messages.push(...response(context.response));
            }

            syslog[severity](...messages);

        }).catch(console.error);

        //
        // const responseClose = new Promise<void>((resolve, reject) => {
        //     context.res.on('close', resolve);
        // });
        //
        // const responseFinish = new Promise<void>((resolve, reject) => {
        //     context.res.on('finish', resolve);
        // });
        //
        // Promise.race([responseFinish, responseClose]).then(()=>{
        //
        //     const messages = [
        //         ...transaction(context.request, context.response),
        //         ...request(context.request),
        //         ...response(context.response),
        //     ];
        //
        //     syslog[severity](...messages);
        //
        // }).catch(console.error);

        return context;
    };
}


export function PrintAutoVerboseParameter<ContextType extends Context, Log extends Syslog<[string, any, any]>>(
    {
        syslog,
        severity = 'debug',
        transaction,
        request,
        response,
    } : {
        syslog : Log,
        severity ?: keyof Syslog ,
        transaction ?: Callable<[Request, Response], any[]>,
        request ?: Callable<[Request], any[]>,
        response ?: Callable<[Response], any[]>,
    }
) {
    return PrintAutoVerboseParameters(syslog, severity, transaction, request, response);
}

namespace PrintAutoVerbose {
    export const Parameters = PrintAutoVerboseParameters;
    export const Parameter = PrintAutoVerboseParameter;
}

export default PrintAutoVerbose;
