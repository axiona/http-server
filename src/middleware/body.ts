import Context from '../context/context.js';
import Middleware from './middleware.js';
import {O} from 'ts-toolbelt';

type BodyJsonReturn<Argument extends Context, Body extends unknown> = Middleware<
    Argument,
    O.P.Omit<Argument, ['request', 'body']> & { request: { body : Body } }
>;



export function Body<Argument extends Context, Body extends unknown>(
    middlewares : [...BodyJsonReturn<Argument, Body>[]]
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
