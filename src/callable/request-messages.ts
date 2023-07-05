import {Request, Response} from "koa";
import {PickParameters} from '@alirya/object/pick.js';
import Callable from '@alirya/function/callable.js';


export default function RequestMessages() : Callable<[Request, Response], any[]>;

export default function RequestMessages(
    keys : string[],
) : Callable<[Request, Response], any[]>;

export default function RequestMessages(
    keys : string[],
    line : Callable<[Request, Response], string>
) : Callable<[Request, Response], [string, ...any[]]>;

export default function RequestMessages(
    keys : string[],
    line : null
) : Callable<[Request, Response], any[]>;

export default function RequestMessages(
    keys : string[] = ['headers', 'body'],
    line : Callable<[Request, Response], string>|null = () => 'request',
) : Callable<[Request, Response], any[]> {

    return function (request, response) {

        const result : any[] = [];

        if(line) {

            result.push(line(request, response));
        }

        for (const key of keys) {

            result.push(
                PickParameters(request, key as keyof Request)
            );
        }

        return result;

    };
}
//
// export default function RequestMessages(
//     request: Request & Partial<Body>,
//     label: string|null = 'request',
//     line = false
// ) : any[] {
//
//     const result : any[] = [];
//
//     if(line) {
//
//         result.push(`${request.method} ${request.path}`);
//     }
//
//     if(label) {
//
//         result.push(label);
//     }
//
//     result.push(
//         PickParameters(request, 'headers')
//     );
//
//     result.push(
//         PickParameters(request, 'body')
//     );
//
//     return result;
// }