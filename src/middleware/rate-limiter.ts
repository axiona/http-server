import {RateLimiterAbstract} from "rate-limiter-flexible";
import Context from "../context/context.js";
import Callable from '@alirya/function/callable.js';
import Response from "@alirya/http/response/response.js";
import {TooManyRequestsParameters} from '@alirya/http/response/too-many-requests.js';
import Middleware from "./middleware.js";
import {SetResponseParameters} from "../context/set-response.js";

type RateLimiterArgumentsConsumeReturn = {
    key : string|number;
    point ?: number;
};

export default function RateLimiter<
    ContextType extends Context
>(
    limiter: RateLimiterAbstract,
    consume: Callable<[ContextType], RateLimiterArgumentsConsumeReturn>,
    response : Callable<[ContextType], Response> = () => TooManyRequestsParameters()
): Middleware<ContextType> {

    return function (context ) {

        const {key, point = 1} = consume(context);

        return limiter.consume(key, point).then(() => {

            return context;

        }).catch(error => {

            SetResponseParameters(context, response(context));
        });
    };
}