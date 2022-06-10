import Response from '@alirya/http/response/response';
import BodyType from '@alirya/http/body/body';
import Context from './context';
import {O} from 'ts-toolbelt';


export type FromResponseReturn<
    Body extends unknown,
    ContextType extends Context
> = O.P.Omit<ContextType, ['response', 'body']> & {
    response: BodyType<Body>
};

export function FromResponseParameters<Body extends unknown, ContextType extends Context>(
    context : ContextType,
    response : Response<number, string, Record<string, string>, Body>,
) : FromResponseReturn<Body, ContextType> {

    context.response.set(response.headers);
    context.response.body = response.body;
    context.response.status = response.code;
    context.response.message = response.message;

    return context as FromResponseReturn<Body, ContextType>;
}


export function FromResponseParameter<
    Body extends unknown,
    ContextType extends Context
>(  {
        context,
        response
    } : {
        context : Context,
        response : Response,
    }
) : FromResponseReturn<Body, ContextType> {

    return FromResponseParameters(context, response) as FromResponseReturn<Body, ContextType> ;
}

namespace FromResponse {
    export const Parameter = FromResponseParameter;
    export const Parameters = FromResponseParameters;
    export type Return<Body extends unknown, ContextType extends Context> = FromResponseReturn<Body, ContextType>;
}

export default FromResponse;
