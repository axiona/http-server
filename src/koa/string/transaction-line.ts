import {Request, Response} from "koa";
import RequestLine from "./request-line.js";
import ResponseLine from "./response-line.js";

/**
 * get the transaction request & response line
 *
 * @param {Request} request
 * @param {Response} response
 * @param {string} separator
 * @constructor
 */
export default function TransactionLine(
    request: Request,
    response: Response,
    separator: string = '->'
) : string {

    return `${RequestLine(request)} ${separator} ${ResponseLine(response)}`;
}