import Context from "./context";
import {fromStream} from "file-type";
import MimeError from "../throwable/mime-error";
import ContentType from '@alirya/http/headers/header/content-type';
import {Readable, PassThrough} from "stream";


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

        throw new MimeError(`Cannot detect mime from stream`);
    }

    context.response.set(ContentType(mime));
    context.response.body = readable;

    return context as Ctx & {response:{body:Readable}};
}