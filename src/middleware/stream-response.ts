import Context from "../context/context";
import Callable from '@alirya/function/callable';
import Middleware from "./middleware";
import {promises, createReadStream, PathLike, ReadStream} from "fs";
import {charsets, extension, lookup, contentType} from 'mime-types';
import Extension, {ExtensionParameters} from "@alirya/uri/path/file/string/extension";
import {fromBuffer, fromStream} from "file-type";
import MimeError from "../throwable/mime-error";
import ContentType from '@alirya/http/headers/header/content-type';
import Union from '@alirya/promise/union';
import { Writable, Readable, PassThrough } from 'stream';
import FromReadable from "../context/from-readable";

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

        let {readable, mime} = StreamResponseUnpackArgument(await option(context));

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