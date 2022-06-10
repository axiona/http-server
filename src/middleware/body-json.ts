import buddy, {Options, json} from 'co-body';
import forms from 'formidable';
import * as qs from 'qs';
import Context from '../context/context';
import Middleware from './middleware';
import {O} from 'ts-toolbelt';
import JsonMimeTypes from '../array/json-mime-types';
import {Required} from 'utility-types';
import {BodyTextArgument, BodyTextArgumentDefault, BodyTextParameter} from './body-text';



type BodyJsonReturn<Argument extends Context> = Middleware<
    Argument,
    O.P.Omit<Argument, ['request', 'body']> & {request: { body : Record<PropertyKey, any> }}
>;

/**
 * for default value {@see BodyJsonArgumentDefault}
 *
 * @see BodyJsonArgument.limit
 * The byte (if integer) limit of the JSON body
 *
 * @see BodyJsonArgument.encoding
 * Sets encoding for incoming form fields
 */
export type BodyJsonArgument = Partial<Pick<Options, 'encoding'|'limit'>>;

/**
 * @see BodyTextArgumentDefault
 */
export const BodyJsonArgumentDefault : Required<BodyTextArgument, 'limit'|'encoding'> = BodyTextArgumentDefault;

/**
 * @param argument
 * @default {@see BodyJsonArgumentDefault}
 */
export function BodyJsonParameter<Argument extends Context>(
    argument : BodyJsonArgument = {}
) : BodyJsonReturn<Argument> {
    argument = Object.assign({}, BodyTextArgumentDefault, argument);
  return function (context) {

    if (context.request.is(JsonMimeTypes as string[])) {

      return  json(context, argument).then(body=>{

        Object.assign(context.request, {body});

        return context;

      });
    }

  } as BodyJsonReturn<Argument>;
}



/**
 * arguments version of {@see BodyJsonParameters}
 *
 * @param limit
 * @default {@see BodyJsonArgumentDefault.limit}
 *
 * @param encoding
 * @default {@see BodyJsonArgumentDefault.encoding}
 */
export function BodyJsonParameters<Argument extends Context>(
    limit : string|number = BodyJsonArgumentDefault.limit,
    encoding : string = BodyJsonArgumentDefault.encoding,
) : BodyJsonReturn<Argument> {

    return BodyJsonParameter({limit, encoding});
}


namespace BodyJson {

    export type Return<Argument extends Context> = BodyJsonReturn<Argument>;
    export const Parameters = BodyJsonParameters;
    export type Argument = BodyJsonArgument;
    export const Parameter = BodyJsonParameter;
}

export default BodyJson;
