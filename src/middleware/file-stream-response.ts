import Context from "../context/context";
import Callable from '@alirya/function/callable';
import Middleware from "./middleware";
import {promises, createReadStream, PathLike, ReadStream} from "fs";
import {charsets, extension, lookup, contentType} from 'mime-types';
import Extension, {ExtensionParameters} from "@alirya/uri/path/file/string/extension";
import {fromBuffer, fromStream} from "file-type";
import MimeError from "../throwable/mime-error";
import ContentType from '@alirya/http/headers/header/content-type';
import String from '@alirya/string/boolean/string';
import { Writable, Readable } from 'stream';
import FromBuffer from "../context/from-buffer";
import FromReadable from "../context/from-readable";

export type FileStreamResponseCallbackType = string|{
    path: string,
    options?: BufferEncoding
};

export default function FileStreamResponseResponse<
    Ctx extends Context
>(
    option: Callable<[Ctx], FileStreamResponseCallbackType>
) : Middleware<Ctx, Ctx & {response:{body:Readable}}> {

    return async function (context) {

        const {options, path} = FileStreamResponseFixArgument(option(context));

        const stream = createReadStream(path, options);

        let mime : string|false = lookup(path);

        try {

            return await FromReadable(context, stream, mime || undefined);

        } catch (error) {

            if(error instanceof MimeError) {

                throw new MimeError(`Cannot detect mime from ${path}`);
            }

            throw error;
        }

        // let mime : string|false = lookup(path);
        //
        // if(!mime) {
        //
        //     const result = await fromStream(buffer);
        //
        //     if(result && result.mime) {
        //
        //         mime = result.mime;
        //     }
        // }
        //
        // if(!mime) {
        //
        //     throw new MimeError(`Cannot detect mime from ${path}`);
        // }
        //
        // context.response.set(ContentType(mime));
        // context.body = buffer;
    };

}


export function FileStreamResponseFixArgument<Ctx extends Context> (
    option : FileStreamResponseCallbackType
) : Exclude<FileStreamResponseCallbackType, string> {


    if(String(option)) {

        return {path : option};
    }

    return option;
}