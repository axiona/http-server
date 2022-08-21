import Context from "../context/context";
import Callable from '@alirya/function/callable';
import Middleware from "./middleware";
import FromBuffer from "../context/from-buffer";
import Union from "../../../promise/dist/union";


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

        let {buffer, mime} = BufferResponseUnpackArgument(await option(context));

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