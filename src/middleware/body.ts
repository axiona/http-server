import Context from '../context/context';
import Middleware from './middleware';
import {O} from 'ts-toolbelt';
import {json, Options} from 'co-body';
import {Required} from 'utility-types';
import {BodyTextArgument, BodyTextArgumentDefault} from './body-text';
import JsonMimeTypes from '../array/json-mime-types';
import FindParameters from '../../../iterable/dist/value/find-parameters';

type BodyJsonReturn<Argument extends Context, Body extends unknown> = Middleware<
    Argument,
    O.P.Omit<Argument, ['request', 'body']> & { request: { body : Body } }
>;

export function Body<Argument extends Context, Body extends unknown>(
    ...middlewares : BodyJsonReturn<Argument, Body>[]
) : BodyJsonReturn<Argument, Body> {

    return function (context) {

        for(const middleware of middlewares) {

            const ctx = middleware(context);

            if(ctx) {

                return ctx;
            }

        }

        return ;
    };
}
