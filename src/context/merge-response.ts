import Response from '@alirya/http/response/response.js';
import Context from './context.js';
import {O} from 'ts-toolbelt';


export type MergeResponseReturn<
    Body extends unknown,
    ContextType extends Context
> = O.P.Update<ContextType, ['response', 'body'], Body>;

export function MergeResponseParameters<Body extends unknown, ContextType extends Context>(
    context : ContextType,
    response : Response<Body>,
) : MergeResponseReturn<Body, ContextType> {

    for(const [name, value] of Object.entries(response.headers)) {
        context.response.append(name, value);
    }
    context.response.body = response.body;
    context.response.status = response.status;
    context.response.message = response.message;

    return context as MergeResponseReturn<Body, ContextType>;
}


export function MergeResponseParameter<
    Body extends unknown,
    ContextType extends Context
>(  {
        context,
        response
    } : {
        context : Context,
        response : Response,
    }
) : MergeResponseReturn<Body, ContextType> {

    return MergeResponseParameters(context, response) as MergeResponseReturn<Body, ContextType> ;
}

namespace MergeResponse {
    export const Parameter = MergeResponseParameter;
    export const Parameters = MergeResponseParameters;
    export type Return<Body extends unknown, ContextType extends Context> = MergeResponseReturn<Body, ContextType>;
}

export default MergeResponse;
