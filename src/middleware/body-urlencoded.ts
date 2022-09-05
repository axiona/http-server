import {Options, form} from 'co-body';
import * as qs from 'qs';
import Context from '../context/context';
import Middleware from './middleware';
import {O} from 'ts-toolbelt';
import Omit from '@alirya/object/omit';
import AddAcceptHeaders from "../router/void/add-accept-headers";


type BodyUrlencodedReturn<Argument extends Context> = Middleware<
    Argument,
    O.P.Omit<Argument, ['request', 'body']> & {request: { body : Record<PropertyKey, any> }}
    >;

export interface BodyUrlencodedArgument extends qs.IParseOptions {
    limit : string|number;
}

export const BodyUrlencodedArgumentDefault : BodyUrlencodedArgument = Object.freeze({
    limit : '1mb',
    charset : 'utf-8',
});


export default function BodyUrlencoded<Argument extends Context>(
    argument : Partial<BodyUrlencodedArgument> = {}
) : BodyUrlencodedReturn<Argument> {

    const option : Options = Object.assign({}, BodyUrlencodedArgumentDefault, {
        limit: argument.limit,
        encoding: argument.charset,
        queryString: Omit.Parameters(argument, 'limit')
    });

    const register : Middleware['register'] = (router) =>AddAcceptHeaders(router, 'application/x-www-form-urlencoded');

    return Object.assign(function (context) {

        if (context.request.is('urlencoded')) {

            return form(context, option).then(body=>{

                Object.assign(context.request, {body});

                return context;

            }).catch(error => {

                Object.assign(error, {router:context.router});
                throw error;
            });
        }

        return context;

    }, register) as BodyUrlencodedReturn<Argument>;
}
