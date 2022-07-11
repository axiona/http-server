import {Options, form} from 'co-body';
import * as qs from 'qs';
import Context from '../context/context';
import Middleware from './middleware';
import {O} from 'ts-toolbelt';
import Omit from '@alirya/object/omit';


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
        encoding:argument.charset,
        queryString:Omit.Parameters(argument, 'limit')
    });

  return function (context) {

    if (context.request.is('urlencoded')) {

      return form(context, option).then(body=>{

        Object.assign(context.request, {body});

        return context;

      });
    }

  } as BodyUrlencodedReturn<Argument>;
}
