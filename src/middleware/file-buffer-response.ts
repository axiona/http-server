import Context from "../context/context";
import Callable from '@alirya/function/callable';
import Middleware from "./middleware";
import {promises} from "fs";
import {lookup} from 'mime-types';
import MimeError from "../throwable/mime-error";
import String from '@alirya/string/boolean/string';
import {OpenMode} from "fs";
import {Abortable} from "events";
import FromBuffer from "../context/from-buffer";
import Union from "../../../promise/dist/union";


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

        let mime : string|false = lookup(path);

        try {

            return await FromBuffer(context, buffer, mime || undefined);

        } catch (error) {

            if(error instanceof MimeError) {

                throw new MimeError(`Cannot detect mime from ${path}`);
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