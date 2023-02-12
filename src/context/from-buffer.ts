import Context from './context.js';
// import {fromBuffer} from "file-type";
import FileType from "file-type";
import ContentType from '@alirya/http/headers/header/content-type.js';
import HttpError from "http-errors";

const {fromBuffer} = FileType;

export default async function FromBuffer<Ctx extends Context>(
    context: Ctx,
    buffer: Buffer,
    mime?: string
) : Promise<Ctx & {response:{body:Buffer}}> {

    if(!mime) {

        const result = await fromBuffer(buffer);

        if(result && result.mime) {

            mime = result.mime;
        }
    }

    if(!mime) {

        throw new HttpError.UnsupportedMediaType(`Cannot detect mime from BufferResponse`);
    }

    context.response.set(ContentType(mime));
    context.response.body = buffer;

    return context as Ctx & {response:{body:Buffer}};
}