import {Request, Response} from "koa";
import {PickParameters} from '@axiona/object/pick.js';
import Callable from '@axiona/function/callable.js';


export default function ResponseMessages() : Callable<[Request, Response], any[]>;

export default function ResponseMessages(
    keys : string[],
) : Callable<[Request, Response], any[]>;

export default function ResponseMessages(
    keys : string[],
    line : Callable<[Request, Response], string>
) : Callable<[Request, Response], [string, ...any[]]>;

export default function ResponseMessages(
    keys : string[],
    line : null
) : Callable<[Request, Response], any[]>;

export default function ResponseMessages(
    keys : string[] = ['headers', 'body'],
    line : Callable<[Request, Response], string>|null = () => 'response',
) : Callable<[Request, Response], any[]> {

    return function (request, response) {

        const result : any[] = [];

        if(line) {

            result.push(line(response.request, response));
        }

        for (const key of keys) {

            result.push(
                PickParameters(response, key as keyof Response)
            );
        }

        return result;

    };
}
