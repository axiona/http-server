import Formidable from 'formidable';
import Context from '../context/context.js';
import Middleware from './middleware.js';
import {O} from 'ts-toolbelt';
import Callable from '@alirya/function/callable.js';
import {AffixParsersParameters} from '../object/affix-parsers.js';
import OmitUndefined from "@alirya/object/omit-undefined.js";
import File from '../file/file.js';
import FromFormidable from '../file/from-formidable.js';
import AddAcceptHeaders from '../router/void/add-accept-headers.js';
import { v4 } from 'uuid';
import {RemovePrefixParameters} from '@alirya/string/remove-prefix.js';
import error from "../catch/error";
import NoOp from '@alirya/function/no-op.js';
import Delete from "../file/delete.js";
import ResponseEnd from "../promise/response-end.js";
import {extension} from "mime-types";

const {defaultOptions, IncomingForm} = Formidable;
type Options = Formidable.Options;
type FormidableFile = Formidable.File;
type Part = Formidable.Part;

export type BodyMultipartReturnRecursive<Type> = {
    [Key in string]: Type|Record<PropertyKey, BodyMultipartReturnRecursive<Type>>|BodyMultipartReturnRecursive<Type>[]
};


export type BodyMultipartContextBodyDefaultValue = string|number|boolean|File|any;
export type BodyMultipartContextBody = Record<PropertyKey, BodyMultipartContextBodyDefaultValue|BodyMultipartContextBodyDefaultValue[]>;


export type BodyMultipartTypeContext<
    Argument extends Context,
    // Body extends BodyMultipartReturnRecursive<string|number|boolean|File> = BodyMultipartReturnRecursive<string|number|boolean|File>,
    Body extends BodyMultipartContextBody = BodyMultipartContextBody,
    > = O.P.Omit<Argument, ['request', 'body']> & {
    request: {
        body : Body,
        fields : ReadonlyArray<[string, string|number|boolean]>,
        files : ReadonlyArray<[string, File]>,
    }
};

export type BodyMultipartType<
    Argument extends Context,
    // Body extends BodyMultipartReturnRecursive<string|number|boolean|File> = BodyMultipartReturnRecursive<string|number|boolean|File>,
    Body extends BodyMultipartContextBody = BodyMultipartContextBody,
> = Middleware<Argument, BodyMultipartTypeContext<Argument, Body>>;

export interface BodyMultipartArgument<Argument extends Context> extends Options {
    mapper : Callable<[ReadonlyArray<[string, any]>]>;
    parser : Callable<[string, string|number|boolean|File], any>;
    autoDeleteFile ?: boolean;
    autoDeleteFileErrorHandler ?: (error)=>void;
}

export const BodyMultipartArgumentDefault : BodyMultipartArgument<Context> = Object.freeze(Object.assign({
    mapper : AffixParsersParameters(),
    parser : (key, value)=>value,
    filename : (name: string, ext: string, part: Part, form: FormidableFile) => {

        if(!ext) {

            for(let mime of [part.mimetype, form.mimetype]) {

                if(!mime) {
                    continue;
                }

                let detected = extension(mime);

                if(!detected) {
                    continue;
                }

                ext = detected;
                break;
            }
        }

        let basename = v4().split('-');
        basename.push((new Date()).getTime().toString(36));

        if(ext) {
            ext = RemovePrefixParameters(ext, '.');
            basename.push(`.${ext}`);
        }

        return basename.join('');


        // console.log('---------------------------');
        // console.log({name,             ext});
        // console.log(part);
        // console.log(form);
        // return v4().split('-').join('') +
        //     (new Date()).getTime().toString(36) +
        //     '.' +
        //     RemovePrefixParameters(ext, '.');
    },
    autoDeleteFile: false,
    autoDeleteFileErrorHandler: NoOp
}, defaultOptions as any as Options));

export default function BodyMultipart<Argument extends Context>(
    argument ?: Partial<BodyMultipartArgument<Argument>>
) : BodyMultipartType<Argument>;


export default function BodyMultipart<Argument extends Context>(
    argument : (Partial<BodyMultipartArgument<Argument>>) = {}
) : BodyMultipartType<Argument> {

    const required = Object.assign({}, BodyMultipartArgumentDefault, OmitUndefined(argument));

    const parser : Callable<[string, any], any> = required.parser;

    const register : Middleware['register'] = (router) => {
        AddAcceptHeaders(router, 'multipart/form-data');
        return router;
    };

    return Object.assign(function (context) {

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

    }, {register}) as BodyMultipartType<Argument, BodyMultipartReturnRecursive<string|number|boolean|File>>;
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

        if(argument.autoDeleteFile) {

            ResponseEnd(context.res).then(()=>{
                files.map(([, file])=>Delete(file, argument.autoDeleteFileErrorHandler));
            });
        }

        form.parse(context.req);
    });
}
