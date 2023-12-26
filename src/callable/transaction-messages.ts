import {Request, Response} from "koa";
import Callable from '@axiona/function/callable.js';
import RequestMessages from "./request-messages.js";
import ResponseMessages from "./response-messages.js";
import TransactionLine from "../koa/string/transaction-line.js";
//
// export default function TransactionMessages(
//     request:Request,
//     response:Response
// ) : any[] {
//
//     return [
//         `${request.method} ${request.path} -> ${response.status} ${response.message}`
//     ];
// }
//
//
// export default function TransactionMessages(
//     requestKeys : string[],
//     requestKeys : string[],
//     line : Callable<[Request, Response], string>
// ) : Callable<[Request, Response], [string, ...any[]]>;
//
// export default function TransactionMessages(
//     requestKeys : string[],
//     requestKeys : string[],
//     line : null
// ) : Callable<[Request, Response], any[]>;

export default function TransactionMessages(
    line : Callable<[Request, Response], string> = TransactionLine,
    request : Callable<[Request, Response], any[]> = RequestMessages(),
    response : Callable<[Request, Response], any[]> = ResponseMessages(),
) : Callable<[Request, Response], [string, ...any[]]> {

    return function (req, res) {

        // console.log([
        //     line(req, res),
        //     ... request(req, res),
        //     ... response(req, res),
        // ]);

        return [
            line(req, res),
            ... request(req, res),
            ... response(req, res),
        ];
    };
}
