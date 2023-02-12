import {Request} from "koa";
import {PickParameters} from '@alirya/object/pick.js';
import Body from "@alirya/http/body/body.js";


export default function RequestMessages(
    request: Request & Partial<Body>,
    label: string|null = 'request',
    line = false
) : any[] {

    const result : any[] = [];

    if(line) {

        result.push(`${request.method} ${request.path}`);
    }

    if(label) {

        result.push(label);
    }

    result.push(
        PickParameters(request, 'headers')
    );

    result.push(
        PickParameters(request, 'body')
    );

    return result;
}