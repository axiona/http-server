// import Context from '../context/context.js';
// import Syslog from '@alirya/syslog/syslog.js';
// import Middleware from './middleware.js';
// import Callable from '@alirya/function/callable.js';
// import {Response} from "koa";
// import ResponseMessages from '../callable/response-messages';
//
// export function PrintResponseParameters<ContextType extends Context, Log extends Syslog<any[]>>(
//     syslog: Log,
//     severity : keyof Syslog = 'debug',
//     response : Callable<[Response], any[]> = (response) => ResponseMessages(response, null, true),
// ) : Middleware<ContextType> {
//
//     return function (context) {
//
//         syslog[severity](...response(context.response));
//     };
// }
//
// export function PrintResponseParameter<ContextType extends Context, Log extends Syslog<[string, any, any]>>(
//     {
//         syslog,
//         severity = 'debug',
//     } : {
//         syslog : Log,
//         severity ?: keyof Syslog ,
//     }
// ) {
//     return PrintResponseParameters(syslog, severity);
// }
//
// namespace PrintResponse {
//     export const Parameters = PrintResponseParameters;
//     export const Parameter = PrintResponseParameter;
// }
//
// export default PrintResponse;
