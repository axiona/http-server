import buddy, {text, Options} from 'co-body';
import forms from 'formidable';
import * as qs from 'qs';
import Context from '../context/context';
import Middleware from './middleware';
import {O} from 'ts-toolbelt';
import {Required} from 'utility-types';


type BodyTextReturn<Argument extends Context> = Middleware<
    Argument,
    O.P.Omit<Argument, ['request', 'body']> & {request: { body : Record<PropertyKey, any> }}
>;

/**
 * for default value {@see BodyTextArgumentDefault}
 *
 * @see BodyTextArgument.limit
 * The byte (if integer) limit of the TEXT body
 *
 * @see BodyTextArgument.encoding
 * Sets encoding for incoming form fields
 */
export type BodyTextArgument = Partial<Pick<Options, 'encoding'|'limit'>>;

/**
 * {@see BodyTextArgumentDefault.limit} '1mb'
 * {@see BodyTextArgumentDefault.encoding} 'utf-8'
 */
export const BodyTextArgumentDefault : Required<BodyTextArgument, 'limit'|'encoding'> = Object.freeze({
    limit : '1mb',
    encoding : 'utf-8',
});

/**
 * @param argument
 * @default {@see BodyTextArgumentDefault}
 */
export function BodyTextParameter<Argument extends Context>(
    argument : BodyTextArgument = {}
) : BodyTextReturn<Argument> {

    argument = Object.assign({}, BodyTextArgumentDefault, argument);

  return function (context) {

    if (context.request.is('text/*')) {

      return  text(context, argument).then(body=>{

        Object.assign(context.request, {body});

        return context;

      });
    }

  } as BodyTextReturn<Argument>;
}


/**
 * argument version of {@see BodyTextParameters}
 *
 * @param limit
 * @param encoding
 */
export function BodyTextParameters<Argument extends Context>(
    limit : string|number = BodyTextArgumentDefault.limit,
    encoding : string = BodyTextArgumentDefault.encoding,
) : BodyTextReturn<Argument> {

  return BodyTextParameter({limit, encoding});
}

/**
 * arguments version of {@see BodyTextParameter}
 *
 * @param limit
 * @default {@see BodyTextArgumentDefault.limit}
 *
 * @param encoding
 * @default {@see BodyTextArgumentDefault.encoding}
 */
namespace BodyText {

    export type Return<Argument extends Context> = BodyTextReturn<Argument>;
    export const Parameters = BodyTextParameters;
    export type Argument = BodyTextArgument;
    export const Parameter = BodyTextParameter;
}

export default BodyText;
