import forms, {Options, File, defaultOptions} from 'formidable';
import * as qs from 'qs';
import Context from '../context/context';
import Middleware from './middleware';
import {O} from 'ts-toolbelt';
import SetPathParameters from '../../../object/dist/set-path-parameters';
import {json} from 'co-body';
import Callable from '../../../function/dist/callable';
import AffixParsers from '../object/affix-parsers';

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

export interface BodyMultipartArgument extends Options {
  parser : Callable<[ReadonlyArray<[string, any]>]>;
  separate : boolean;
}

export const BodyMultipartArgumentDefault : BodyMultipartArgument = Object.freeze(Object.assign({
    parser : AffixParsers(),
    separate : false,
}, defaultOptions as any as Options));


export default function BodyMultipart<Argument extends Context>(
    argument : Omit<Partial<BodyMultipartArgument>, 'separate'> & {separate:true}
) : BodyMultipartReturnSeparate<Argument>;

export default function BodyMultipart<Argument extends Context>(
    argument ?: Partial<BodyMultipartArgument>
) : BodyMultipartReturnCombine<Argument>;

export default function BodyMultipart<Argument extends Context>(
    argument : Partial<BodyMultipartArgument> = {}
) : BodyMultipartReturnCombine<Argument> {

    const required = Object.assign(BodyMultipartArgumentDefault, argument);

    return function (context) {

        if (!context.request.is('multipart')) {

            return ;
        }

        return new Promise<Context>(function (resolve, reject) {

            const fields : [string, any][] = [];
            const files : [string, any][] = [];

            const form = new forms.IncomingForm(required);

            form.on('end', function () {

                if(required.separate) {

                    context.request['body'] =
                        {
                            files : required.parser(files),
                            fields : required.parser(fields),
                        };

                } else {

                    context.request['body'] = required.parser([...fields, ...files]);
                }

                resolve(context);


            }).on('error', function (err) {

                return reject(err);

            }).on('field', function (field, value) {

                fields.push([field, value]);

            }).on('file', function (field, file) {

                files.push([field, file]);
            });


            form.parse(context.req);
        });

    } as BodyMultipartReturnCombine<Argument>;
}
