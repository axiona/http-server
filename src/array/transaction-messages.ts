import {Request, Response} from "koa";


export default function TransactionMessages(
    request:Request,
    response:Response
) : any[] {

    return [
        `${request.method} ${request.path} -> ${response.status} ${response.message}`
    ];
}