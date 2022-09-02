import {Options, defaultOptions, IncomingForm} from 'formidable';
import Context from '../context/context';
import Middleware from './middleware';
import {O} from 'ts-toolbelt';
import Callable from '@alirya/function/callable';
import AffixParsers from '../object/affix-parsers';
import OmitUndefined from "@alirya/object/omit-undefined";
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
            body : BodyMultipartReturnRecursive<string|number|boolean|File>,
            fields : ReadonlyArray<[string, string|number|boolean]>,
            files : ReadonlyArray<[string, File]>,
        }
    }
>;

export interface BodyMultipartArgumentCombine<Argument extends Context> extends Options {
    mapper : Callable<[ReadonlyArray<[string, any]>]>;
    parser : Callable<[string, any], any>;
}

export const BodyMultipartArgumentDefault : BodyMultipartArgumentCombine<Context> = Object.freeze(Object.assign({
    mapper : AffixParsers(),
    parser : (key, value)=>value,
}, defaultOptions as any as Options));

export default function BodyMultipart<Argument extends Context>(
    argument ?: Partial<BodyMultipartArgumentCombine<Argument>>
) : BodyMultipartReturnCombine<Argument>;


export default function BodyMultipart<Argument extends Context>(
    argument : (Partial<BodyMultipartArgumentCombine<Argument>>) = {}
) : BodyMultipartReturnCombine<Argument> {

    const required = Object.assign({}, BodyMultipartArgumentDefault, OmitUndefined(argument));

    const parser : Callable<[string, any], any> = required.parser;

    return function (context) {

        if (!context.request.is('multipart')) {

            return context;
        }

        return new Promise<Context>(function (resolve, reject) {

            const promises : Promise<any>[] = [];
            const fields : [string, any][] = [];
            const files : [string, any][] = [];

            const form = new IncomingForm(required);

            form.on('end', async function () {

                await Promise.all(promises);

                const values : ReadonlyArray<[string, any]> = [...fields, ...files];
                const body = required.mapper(values);

                Object.assign(context.request, {body, fields, files});

                resolve(context);

            }).on('error', function (error) {

                return reject(Object.assign(error, {router:context.router}));

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