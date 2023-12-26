import Context from './context.js';
// import {fromStream} from "file-type";
import FileType from "file-type";
import ContentType from '@axiona/http/headers/header/content-type.js';
import {Readable, PassThrough} from "stream";
import HttpError from "http-errors";

const {fromStream} = FileType;

export default async function FromReadable<Ctx extends Context>(
    context: Ctx,
    readable: Readable,
    mime?: string
) : Promise<Ctx & {response:{body:Readable}}> {

    if(!mime) {

        const pssthrough =  readable.pipe(new PassThrough());

        const result = await fromStream(readable);

        readable = pssthrough;

        if(result && result.mime) {

            mime = result.mime;
        }
    }

    if(!mime) {

        throw new HttpError.UnsupportedMediaType(`Cannot detect mime from stream`);
    }

    context.response.set(ContentType(mime));
    context.response.body = readable;

    return context as Ctx & {response:{body:Readable}};
}
