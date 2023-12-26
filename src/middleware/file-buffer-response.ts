import Context from '../context/context.js';
import Callable from '@axiona/function/callable.js';
import Middleware from './middleware.js';
import {promises} from "fs";
import {lookup} from 'mime-types';
import String from '@axiona/string/boolean/string.js';
import {OpenMode} from "fs";
import {Abortable} from "events";
import FromBuffer from '../context/from-buffer.js';
import Union from '@axiona/promise/union.js';
import HttpError from "http-errors";


export type FileBufferResponseCallbackTypeOptions = {
    flag?: OpenMode;
} & Abortable;


export type FileBufferResponseCallbackType = string|{
    path: string,
    options?: FileBufferResponseCallbackTypeOptions;
};

export default function FileBufferResponse<
    Ctx extends Context
>(
    option: Callable<[Ctx], Union<FileBufferResponseCallbackType>>
) : Middleware<Ctx, Ctx & {response:{body:Buffer}}> {

    return async function (context) {

        const {options, path} = FileBufferResponseFixArgument(await option(context));

        const buffer = await promises.readFile(path, options);

        const mime : string|false = lookup(path);

        try {

            return await FromBuffer(context, buffer, mime || undefined);

        } catch (error) {

            if(HttpError.isHttpError(error) && error.statusCode === 415) {

                throw new HttpError.UnsupportedMediaType(`Cannot detect mime from ${path}`);
            }

            throw error;

        }
    };

}


export function FileBufferResponseFixArgument<Ctx extends Context> (
    option : FileBufferResponseCallbackType
) : Exclude<FileBufferResponseCallbackType, string> {


    if(String(option)) {

        return {path : option};
    }

    return option;
}
