import {Response} from "koa";

/**
 * get the transaction response line
 *
 * @param response
 */
export default function ResponseLine(
    response: Response
) : string {

    return `${response.status} ${response.message}`;
}