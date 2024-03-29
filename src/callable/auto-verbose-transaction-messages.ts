import {Request, Response} from "koa";
import Callable from '@axiona/function/callable.js';
import RequestMessages from "./request-messages.js";
import ResponseMessages from "./response-messages.js";
import TransactionLine from "../koa/string/transaction-line.js";
import ConditionalCall from '@axiona/function/conditional-call.js';
import StatusCode from "../koa/callable/status-code.js";
import Successful from '@axiona/http/response/status/class/boolean/successful.js';
import Constant from '@axiona/function/constant.js';
import {ConditionalCallParameters} from '@axiona/function/conditional-call.js';
import TransactionMessages from "./transaction-messages.js";

export default function AutoVerboseTransactionMessages(
    line : Callable<[Request, Response], string> = TransactionLine,
    request : Callable<[Request, Response], any[]> = RequestMessages(),
    response : Callable<[Request, Response], any[]> = ResponseMessages(),
) : Callable<[Request, Response], [string, ...any[]]> {

    return TransactionMessages(
        line,
        ConditionalCallParameters((req, res) => StatusCode(Successful)(res), Constant([]), request),
        ConditionalCallParameters((req, res) => StatusCode(Successful)(res), Constant([]), response)
    );
}
