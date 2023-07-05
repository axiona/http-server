// import Middleware from './middleware.js';
// import Context from '../context/context.js';
// import Syslog from '@alirya/syslog/syslog.js';
// import Callable from '@alirya/function/callable.js';
// import {Request} from "koa";
// import RequestMessages from '../callable/request-messages';
//
// export function PrintRequestParameters<ContextType extends Context, Log extends Syslog<any[]>>(
//     syslog: Log,
//     severity : keyof Syslog = 'debug',
//     request : Callable<[Request], any[]> = (request) => RequestMessages(request, null, true),
// ) : Middleware<ContextType> {
//
//     return function (context) {
//
//         syslog[severity](...request(context.request));
//     };
// }
//
// export function PrintRequestParameter<ContextType extends Context, Log extends Syslog<[string, any, any]>>(
//     {
//         syslog,
//         severity = 'debug',
//     } : {
//         syslog : Log,
//         severity ?: keyof Syslog ,
//     }
// ) {
//     return PrintRequestParameters(syslog, severity);
// }
//
// namespace PrintRequest {
//     export const Parameters = PrintRequestParameters;
//     export const Parameter = PrintRequestParameter;
// }
//
// export default PrintRequest;
