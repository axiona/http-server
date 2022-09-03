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


export type BodyMultipartTypeContext<
    Argument extends Context,
    Body extends BodyMultipartReturnRecursive<string|number|boolean|File> = BodyMultipartReturnRecursive<string|number|boolean|File>,
    > = O.P.Omit<Argument, ['request', 'body']> & {
    request: {
        body : Body,
        fields : ReadonlyArray<[string, string|number|boolean]>,
        files : ReadonlyArray<[string, File]>,
    }
};

export type BodyMultipartType<
    Argument extends Context,
    Body extends BodyMultipartReturnRecursive<string|number|boolean|File> = BodyMultipartReturnRecursive<string|number|boolean|File>,
> = Middleware<Argument, BodyMultipartTypeContext<Argument, Body>>;

export interface BodyMultipartArgument<Argument extends Context> extends Options {
    mapper : Callable<[ReadonlyArray<[string, any]>]>;
    parser : Callable<[string, string|number|boolean|File], any>;
}

export const BodyMultipartArgumentDefault : BodyMultipartArgument<Context> = Object.freeze(Object.assign({
    mapper : AffixParsersParameters(),
    parser : (key, value)=>value,
}, defaultOptions as any as Options));

export default function BodyMultipart<Argument extends Context>(
    argument ?: Partial<BodyMultipartArgument<Argument>>
) : BodyMultipartType<Argument>;


export default function BodyMultipart<Argument extends Context>(
    argument : (Partial<BodyMultipartArgument<Argument>>) = {}
) : BodyMultipartType<Argument> {

    const required = Object.assign({}, BodyMultipartArgumentDefault, OmitUndefined(argument));

    const parser : Callable<[string, any], any> = required.parser;

    return function (context) {

        if (!context.request.is('multipart')) {

            return context;
        }

        return BodyMultipartParse(context, required).then(async ({files, fields})=>{

            files = await Promise.all(
                files.map(async ([name, file])=>[name, await FromFormidable(file)])
            );

            files  = files.map(([field, file])=>[field, parser(field, file)]);

            fields = fields.map(([field, value]) =>[field, parser(field, value)] as [string, string|number|boolean]);

            const values : ReadonlyArray<[string, string|number|boolean|File]> = [...fields, ...files as [string, File][]];
            const body = required.mapper(values);

            Object.assign(context.request, {body, fields, files});

            return context;
        });

    } as BodyMultipartType<Argument, BodyMultipartReturnRecursive<string|number|boolean|File>>;
}

export type BodyMultipartParseType = {
    fields : ReadonlyArray<[string, string|number|boolean]>,
    files : ReadonlyArray<[string, FormidableFile]>,
};

export function BodyMultipartParse<Argument extends Context>(
    context : Context,
    argument : BodyMultipartArgument<Argument>
) : Promise<BodyMultipartParseType> {

    return new Promise<BodyMultipartParseType>(function (resolve, reject) {

        const fields : [string, string|number|boolean][] = [];
        const files : [string, FormidableFile][] = [];

        const form = new IncomingForm(argument);

        form.on('end', async function () {

            resolve({fields, files});

        }).on('error', function (error) {

            return reject(Object.assign(error, {router:context.router}));

        }).on('field', function (field, value) {

            fields.push([field, value]);

        }).on('file', function (field, file) {

            files.push([field, file]);

        });

        form.parse(context.req);
    });
}
