import {Options, json} from 'co-body';
import Context from '../context/context';
import Middleware from './middleware';
import {O} from 'ts-toolbelt';
import JsonMimeTypes from '../array/json-mime-types';
import {Required} from 'utility-types';
import {BodyTextArgument, BodyTextArgumentDefault} from './body-text';
import OmitUndefined from "@alirya/object/omit-undefined";
import {ResponseParameters} from "./response";
import BadRequest, {BadRequestParameters} from "../../../http/dist/response/bad-request";
import HttpError from "http-errors";
import Omit from "../../../object/dist/omit";
import Pick, {PickParameters} from "../../../object/dist/pick";
import ParseError from "../throwable/parse-error";
// import HttpError from "../../../http/dist/throwable/http-error";



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
export type BodyJsonArgument<Argument extends Context> = Partial<Pick<Options, 'encoding'|'limit'>>/* & {
    invalid ?: BodyJsonReturn<Argument>
    error ?: (error) => BodyJsonReturn<Argument>
}*/;

/**
 * @see BodyTextArgumentDefault
 */
export const BodyJsonArgumentDefault : Required<BodyTextArgument<Context>, 'limit'|'encoding'> = Object.freeze(Object.assign({
   // error: ResponseParameters(BadRequestParameters())
}, BodyTextArgumentDefault));

// export const BodyJsonIsParsed = Symbol('BodyJsonIsParsed');

/**
 * @param argument
 * @default {@see BodyJsonArgumentDefault}
 */
export function BodyJsonParameter<Argument extends Context>(
    argument : BodyJsonArgument<Argument> = {}
) : BodyJsonReturn<Argument> {

    argument = Object.assign({}, BodyTextArgumentDefault, OmitUndefined(argument)) as BodyJsonArgument<Argument>;

    return function (context) {

        // if(context[BodyJsonIsParsed]) {
        //
        //     return context;
        // }

        if (context.request.is(JsonMimeTypes as string[])) {

            return json(context, argument).then(body=>{

                Object.assign(context.request, {body});
                // context[BodyJsonIsParsed] = true;
                return context;

            })/*.catch(error=>{

                throw ParseError(error);
            })*/;
        }

        return context;

        // if(argument.invalid) {
        //
        //     return argument.invalid(context);
        // }

    } as BodyJsonReturn<Argument>;
}



/**
 * arguments version of {@see BodyJsonParameters}
 *
 * @param limit
 * @default {@see BodyJsonArgumentDefault.limit}
 *
 * @param encoding
 * @param invalid
 * @param error
 * @default {@see BodyJsonArgumentDefault.encoding}
 */
export function BodyJsonParameters<Argument extends Context>(
    limit : string|number = BodyJsonArgumentDefault.limit,
    encoding : string = BodyJsonArgumentDefault.encoding,
    // invalid ?: BodyJsonReturn<Argument>,
    // error ?: BodyJsonReturn<Argument>
) : BodyJsonReturn<Argument> {

    return BodyJsonParameter({/*invalid,*/ limit, encoding});
}


namespace BodyJson {

    export type Return<Argument extends Context> = BodyJsonReturn<Argument>;
    export const Parameters = BodyJsonParameters;
    export type Argument<Argument extends Context> = BodyJsonArgument<Argument>;
    export const Parameter = BodyJsonParameter;
}

export default BodyJson;
