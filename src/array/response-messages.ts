import {Response} from "koa";
import {PickParameters} from '@alirya/object/pick';


export default function ResponseMessages(
    response:Response,
    label : string|null = 'response',
    line: boolean = false
) : any[] {

    const result : any[] = [];

    if(line) {

        result.push(`${response.status} ${response.message}`);
    }

    if(label) {

        result.push(label);
    }

    result.push(
        PickParameters(response, 'headers')
    );

    result.push(
        PickParameters(response, 'body')
    );

    return result;
}