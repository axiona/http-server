import Response from '@alirya/http/response/response';
import Context from './context';
import {O} from 'ts-toolbelt';

export type SetResponseReturn<
    Body extends unknown,
    ContextType extends Context
> = O.P.Update<ContextType, ['response', 'body'], Body>;

export function SetResponseParameters<Body extends unknown, ContextType extends Context>(
    context : ContextType,
    response : Response<Body>,
    mergeHeader: boolean = false
) : SetResponseReturn<Body, ContextType> {

    if(mergeHeader) {

        for(const [name, value] of Object.entries(response.headers)) {
            context.response.append(name, value);
        }

    } else {

        context.response.set(response.headers);
    }

    context.response.body = response.body;
    context.response.status = response.status;
    context.response.message = response.message;

    return context as SetResponseReturn<Body, ContextType>;
}


export function SetResponseParameter<
    Body extends unknown,
    ContextType extends Context
>(  {
        context,
        response,
        mergeHeader
    } : {
        context : Context,
        response : Response,
        mergeHeader: boolean
    }
) : SetResponseReturn<Body, ContextType> {

    return SetResponseParameters(context, response, mergeHeader) as SetResponseReturn<Body, ContextType> ;
}

namespace SetResponse {
    export const Parameter = SetResponseParameter;
    export const Parameters = SetResponseParameters;
    export type Return<Body extends unknown, ContextType extends Context> = SetResponseReturn<Body, ContextType>;
}

export default SetResponse;
