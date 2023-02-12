import Context from '../context/context.js';
import Callable from '@alirya/function/callable.js';
import Middleware from './middleware.js';
import FromBuffer from '../context/from-buffer.js';
import Union from '@alirya/promise/union.js';


export type BufferResponseCallbackType = Buffer|{
    buffer: Buffer,
    mime?: string
};

export default function BufferResponse<
    Ctx extends Context
>(
    option: Callable<[Ctx], Union<BufferResponseCallbackType>>
) : Middleware<Ctx, Ctx & {response:{body:Buffer}}> {

    return async function (context) {

        const {buffer, mime} = BufferResponseUnpackArgument(await option(context));

        return FromBuffer(context, buffer, mime);
    };

}


export function BufferResponseUnpackArgument<Ctx extends Context> (
    argument : BufferResponseCallbackType
) : Exclude<BufferResponseCallbackType, Buffer> {

    if(Buffer.isBuffer(argument)) {

        return { buffer: argument };

    } else {

        return argument;

    }
}