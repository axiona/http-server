import Context from "../context/context";
import Callable from '@alirya/function/callable';
import Middleware from "./middleware";
import {fromBuffer, fromStream} from "file-type";
import MimeError from "../throwable/mime-error";
import ContentType from '@alirya/http/headers/header/content-type';
import String from '@alirya/string/boolean/string';
import FromBuffer from "../context/from-buffer";



// export type FileBufferResponseCallbackTypeOptions = {
//     flag?: OpenMode;
// } & Abortable;


export type BufferResponseCallbackType = Buffer|{
    buffer: Buffer,
    mime?: string
};

export default function BufferResponse<
    Ctx extends Context
>(
    option: Callable<[Ctx], BufferResponseCallbackType>
) : Middleware<Ctx, Ctx & {response:{body:Buffer}}> {

    return async function (context) {

        let {buffer, mime} = BufferResponseUnpackArgument(option(context));

        return FromBuffer(context, buffer, mime)
        //
        // if(!mime) {
        //
        //     const result = await fromBuffer(buffer);
        //
        //     if(result && result.mime) {
        //
        //         mime = result.mime;
        //     }
        // }
        //
        // if(!mime) {
        //
        //     throw new MimeError(`Cannot detect mime from BufferResponse`);
        // }
        //
        // context.response.set(ContentType(mime));
        // context.body = buffer;
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