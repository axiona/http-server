import {Request, Response} from "koa";
import {PickParameters} from '@alirya/object/pick';
import Body from "@alirya/http/body/body";


export default function RequestMessages(
    request: Request & Partial<Body>,
    label: string|null = 'request',
    line: boolean = false
) : any[] {

    const result : any[] = [];

    if(line) {

        result.push(`${request.method} ${request.path}`);
    }

    if(label) {

        result.push(label);
    }

    result.push(
        PickParameters(request, 'headers', 'body')
    );

    return result;
}