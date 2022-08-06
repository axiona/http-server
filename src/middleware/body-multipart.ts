import {Options, defaultOptions, IncomingForm} from 'formidable';
import Context from '../context/context';
import Middleware from './middleware';
import {O} from 'ts-toolbelt';
import Callable from '@alirya/function/callable';
import AffixParsers from '../object/affix-parsers';
import {ResponseParameters} from "./response";
import {UnsupportedMediaTypeParameters} from "@alirya/http/response/unsupported-media-type";
import OmitUndefined from "@alirya/object/omit-undefined";
import Stop from "./stop";
import {fromFile} from 'file-type';
import {extension} from 'mime-types';
import File from "../file/file";

export type BodyMultipartReturnRecursive<Type> = {
    [Key in string]: Type|Record<PropertyKey, BodyMultipartReturnRecursive<Type>>|BodyMultipartReturnRecursive<Type>[]
};


export type BodyMultipartReturnCombine<Argument extends Context> = Middleware<
    Argument,
    O.P.Omit<Argument, ['request', 'body']> & {
        request: {
            body : BodyMultipartReturnRecursive<string|number|boolean|File>
        }
    }
>;
export type BodyMultipartReturnSeparate<Argument extends Context> = Middleware<
    Argument,
    O.P.Omit<Argument, ['request', 'body']> & {
        request: {
            body : {
                files : BodyMultipartReturnRecursive<File>,
                fields : BodyMultipartReturnRecursive<string|number|boolean>
            }
        }
    }
>;



export interface BodyMultipartArgumentCombine<Argument extends Context> extends Options {
    mapper : Callable<[ReadonlyArray<[string, any]>]>;
    parser : Callable<[string, any]>;
    separate : false;
    invalid ?: BodyMultipartReturnCombine<Argument>;
}

export interface BodyMultipartArgumentSeparate<Argument extends Context> extends Options {
    mapper : Callable<[ReadonlyArray<[string, any]>]>;
    parser : Callable<[string, any]>;
    separate : true;
    invalid ?: BodyMultipartReturnSeparate<Argument>;
}

export const BodyMultipartArgumentDefault : BodyMultipartArgumentCombine<Context> = Object.freeze(Object.assign({
    mapper : AffixParsers(),
    separate : false,
    invalid : ResponseParameters(UnsupportedMediaTypeParameters(), false) as BodyMultipartReturnCombine<Context>
}, defaultOptions as any as BodyMultipartArgumentCombine<Context>));


export default function BodyMultipart<Argument extends Context>(
    argument : Omit<Partial<BodyMultipartArgumentCombine<Argument>>, 'separate'>
) : BodyMultipartReturnSeparate<Argument>;

export default function BodyMultipart<Argument extends Context>(
    argument ?: Partial<BodyMultipartArgumentCombine<Argument>>
) : BodyMultipartReturnCombine<Argument>;

export default function BodyMultipart<Argument extends Context>(
    argument ?: Partial<BodyMultipartArgumentSeparate<Argument>>
) : BodyMultipartReturnSeparate<Argument>;

export default function BodyMultipart<Argument extends Context>(
    argument : (Partial<BodyMultipartArgumentCombine<Argument>>|Partial<BodyMultipartArgumentSeparate<Argument>>) = {}
) : BodyMultipartReturnCombine<Argument>|BodyMultipartReturnSeparate<Argument> {

    const required = Object.assign({}, BodyMultipartArgumentDefault, OmitUndefined(argument));

    const parser : Callable<[string, any]> = argument.parser ? argument.parser : (key, value)=>value;

    const invalid = required.invalid ? required.invalid : Stop;

    return function (context) {

        if (!context.request.is('multipart')) {

            return invalid(context);
        }

        return new Promise<Context>(function (resolve, reject) {

            const promises : Promise<any>[] = [];
            const fields : [string, any][] = [];
            const files : [string, any][] = [];

            const form = new IncomingForm(required);

            form.on('end', async function () {

                await Promise.all(promises);

                if(required.separate) {

                    context.request['body'] =
                        {
                            files : required.mapper(files),
                            fields : required.mapper(fields),
                        };

                } else {

                    context.request['body'] = required.mapper([...fields, ...files]);
                }

                resolve(context);


            }).on('error', function (err) {

                return reject(err);

            }).on('field', function (field, value) {

                fields.push([field, parser(field, value)]);

            }).on('file', function (field, file) {

                const fileExtension = Object.assign(file, {extension:null});

                const promise = EnsureType(fileExtension)
                    .then(
                        result => files.push([field, parser(field, result)])
                    );

                promises.push(promise);

            });


            form.parse(context.req);
        });

    } as BodyMultipartReturnCombine<Argument>;
}

async function EnsureType(file: File) : Promise<File> {

    // initials
    let promise : Promise<any>|null = null;

    if(!file.mimetype) {

        const result = await fromFile(file.filepath);

        if(result) {

            Object.assign(file, {
                extension: result.ext,
                mimetype: result.mime,
            });
        }
    }

    if(file.mimetype && !file.extension) {

        let ext = extension(file.mimetype);

        if(ext) {

            file.extension = ext;
        }
    }

    return file;
}