import {Options, form} from 'co-body';
import * as qs from 'qs';
import Context from '../context/context';
import Middleware from './middleware';
import {O} from 'ts-toolbelt';
import Omit from '@alirya/object/omit';
import {BodyMultipartReturnCombine} from "./body-multipart";
import {ResponseParameters} from "./response";
import {UnsupportedMediaTypeParameters} from "@alirya/http/response/unsupported-media-type";


type BodyUrlencodedReturn<Argument extends Context> = Middleware<
    Argument,
    O.P.Omit<Argument, ['request', 'body']> & {request: { body : Record<PropertyKey, any> }}
    >;

export interface BodyUrlencodedArgument/*<Argument extends Context>*/ extends qs.IParseOptions {
    limit : string|number;
    // invalid ?: BodyMultipartReturnCombine<Argument>;
}

export const BodyUrlencodedArgumentDefault : BodyUrlencodedArgument/*<Context>*/ = Object.freeze({
    limit : '1mb',
    charset : 'utf-8',
    // invalid : ResponseParameters(UnsupportedMediaTypeParameters(), false) as BodyMultipartReturnCombine<Context>
});


export default function BodyUrlencoded<Argument extends Context>(
    argument : Partial<BodyUrlencodedArgument/*<Argument>*/> = {}
) : BodyUrlencodedReturn<Argument> {

    const option : Options = Object.assign({}, BodyUrlencodedArgumentDefault, {
        limit: argument.limit,
        encoding: argument.charset,
        queryString: Omit.Parameters(argument, 'limit')
    });

    // const invalid = argument.invalid ? argument.invalid : BodyUrlencodedArgumentDefault.invalid;

    return function (context) {

        if (context.request.is('urlencoded')) {

            return form(context, option).then(body=>{

                Object.assign(context.request, {body});

                return context;

            });
        }

        return context;

        // if(invalid) {
        //
        //     return invalid(context);
        // }

    } as BodyUrlencodedReturn<Argument>;
}
