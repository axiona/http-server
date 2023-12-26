import Context from '../context/context.js';
import Callable from '@axiona/function/callable.js';
import Middleware from './middleware.js';
import Union from '@axiona/promise/union.js';
import { Readable } from 'stream';
import FromReadable from '../context/from-readable.js';

export type StreamResponseCallbackType = Readable|{
    readable: Readable,
    mime?: string
};

export default function StreamResponse<
    Ctx extends Context
>(
    option: Callable<[Ctx], Union<StreamResponseCallbackType>>
) : Middleware<Ctx, Ctx & {response:{body:Readable}}> {

    return async function (context) {

        const {readable, mime} = StreamResponseUnpackArgument(await option(context));

        return FromReadable(context, readable, mime);
    };

}


export function StreamResponseUnpackArgument<Ctx extends Context> (
    argument : StreamResponseCallbackType
) : Exclude<StreamResponseCallbackType, Readable> {

    if(argument instanceof Readable) {

        return { readable: argument };

    } else {

        return argument;

    }
}
