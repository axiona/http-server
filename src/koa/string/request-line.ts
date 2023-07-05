import {Request} from "koa";

/**
 * get the transaction request line
 * @param request
 * @constructor
 */
export default function RequestLine(
    request: Request
) : string {

    return `${request.method} ${request.path}`;
}