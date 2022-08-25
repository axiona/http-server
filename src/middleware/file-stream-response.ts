import Context from "../context/context";
import Callable from '@alirya/function/callable';
import Middleware from "./middleware";
import {createReadStream} from "fs";
import {lookup} from 'mime-types';
import String from '@alirya/string/boolean/string';
import { Readable } from 'stream';
import FromReadable from "../context/from-readable";
import Union from '@alirya/promise/union';
import HttpError from "http-errors";

export type FileStreamResponseCallbackType = string|{
    path: string,
    options?: BufferEncoding
};

export default function FileStreamResponseResponse<
    Ctx extends Context
>(
    option: Callable<[Ctx], Union<FileStreamResponseCallbackType>>
) : Middleware<Ctx, Ctx & {response:{body:Readable}}> {

    return async function (context) {

        const {options, path} = FileStreamResponseFixArgument(await option(context));

        const stream = createReadStream(path, options);

        let mime : string|false = lookup(path);

        try {

            return await FromReadable(context, stream, mime || undefined);

        } catch (error) {

            if(HttpError.isHttpError(error) && error.statusCode === 415) {

                throw new HttpError.UnsupportedMediaType(`Cannot detect mime from ${path}`);
            }

            throw error;
        }
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