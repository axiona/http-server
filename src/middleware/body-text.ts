import {text, Options} from 'co-body';
import Context from '../context/context.js';
import Middleware from './middleware.js';
import {O} from 'ts-toolbelt';
import {Required} from 'utility-types';
import OmitUndefined from "@axiona/object/omit-undefined.js";
import AddAcceptHeaders from '../router/void/add-accept-headers.js';


type BodyTextReturn<Argument extends Context> = Middleware<
    Argument,
    O.P.Omit<Argument, ['request', 'body']> & {request: { body : string }}
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
export type BodyTextArgument<Argument extends Context> = Partial<Pick<Options, 'encoding'|'limit'>>;

/**
 * {@see BodyTextArgumentDefault.limit} '1mb'
 * {@see BodyTextArgumentDefault.encoding} 'utf-8'
 */
export const BodyTextArgumentDefault : Required<BodyTextArgument<Context>, 'limit'|'encoding'> = Object.freeze({
    limit : '1mb',
    encoding : 'utf-8',
});

export const BodyTextParameterMimetype = 'text/*';

/**
 * @param argument
 * @default {@see BodyTextArgumentDefault}
 */
export function BodyTextParameter<Argument extends Context>(
    argument : BodyTextArgument<Argument> = {}
) : BodyTextReturn<Argument> {

    argument = Object.assign({}, BodyTextArgumentDefault, OmitUndefined(argument)) as BodyTextArgument<Argument>;

    const register : Middleware['register'] = (router) => {
        AddAcceptHeaders(router, BodyTextParameterMimetype);
        return router;
    };

    return Object.assign(function (context) {

        if (context.request.is(BodyTextParameterMimetype)) {

            return  text(context, argument).then(body=>{

                Object.assign(context.request, {body});

                return context;

            }).catch(error => {

                Object.assign(error, {router:context.router});
                throw error;
            });
        }

        return context;

    }, {register}) as BodyTextReturn<Argument>;
}


/**
 * argument version of {@see BodyTextParameters}
 *
 * @param limit
 * @param encoding
 * @param invalid
 */
export function BodyTextParameters<Argument extends Context>(
    limit : string|number = BodyTextArgumentDefault.limit,
    encoding : string = BodyTextArgumentDefault.encoding,
    invalid ?: BodyTextReturn<Argument>
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
    export type Argument<Argument extends Context> = BodyTextArgument<Argument>;
    export const Parameter = BodyTextParameter;
}

export default BodyText;
