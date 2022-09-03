import {Options, defaultOptions, IncomingForm, File as FormidableFile} from 'formidable';
import Context from '../context/context';
import Middleware from './middleware';
import {O} from 'ts-toolbelt';
import Callable from '@alirya/function/callable';
import {AffixParsersParameters} from '../object/affix-parsers';
import OmitUndefined from "@alirya/object/omit-undefined";
import {fromFile} from 'file-type';
import {extension} from 'mime-types';
import File from "../file/file";
import FromFormidable from "../file/from-formidable";

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
    parser : Callable<[string, string|number|boolean|File], any>;
}

export const BodyMultipartArgumentDefault : BodyMultipartArgumentCombine<Context> = Object.freeze(Object.assign({
    mapper : AffixParsersParameters(),
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

            const fieldsRaw : [string, string|number|boolean][] = [];
            const filesRaw : [string, FormidableFile][] = [];

            const form = new IncomingForm(required);

            form.on('end', async function () {

                const promisesFiles = filesRaw
                    .map(async ([name, file])=>[name, await FromFormidable(file)] as [string, File]);
                let filesEnsured = await Promise.all(promisesFiles);

                // parse
                let files  = filesEnsured.map(([field, file])        =>[field, parser(field, file)] as [string, File]);
                let fields =    fieldsRaw.map(([field, value]) =>[field, parser(field, value)] as [string, string|number|boolean]);

                const values : ReadonlyArray<[string, string|number|boolean|File]> = [...fields, ...files];
                const body = required.mapper(values);

                Object.assign(context.request, {body, fields, files});

                resolve(context);

            }).on('error', function (error) {

                return reject(Object.assign(error, {router:context.router}));

            }).on('field', function (field, value) {

                fieldsRaw.push([field, value]);

            }).on('file', function (field, file) {

                filesRaw.push([field, file]);

            });

            form.parse(context.req);
        });

    } as BodyMultipartReturnCombine<Argument>;
}

