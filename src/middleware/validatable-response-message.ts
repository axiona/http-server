import {O} from 'ts-toolbelt';
import Middleware from './middleware.js';
import Validatable from '@alirya/validator/validatable/validatable.js';
import Response from '@alirya/http/response/response.js';
import {UnprocessableEntityParameter} from '@alirya/http/response/unprocessable-entity.js';
import Context from '../context/context.js';
import {SelectPathParameters} from '@alirya/object/value/value/select-path.js';
import FromResponse from '../context/set-response.js';

export type ValidatableResponseMessageReturn<
    Property extends PropertyKey[],
    ValidatorType extends Validatable,
    Argument extends Context ,
> = Middleware<
    Argument & O.P.Record<Property, ValidatorType>,
    O.P.Record<Property, ValidatorType> & O.P.Update<Argument, ['response', 'body'], ValidatorType['message']>
> ;

export function ValidatableResponseMessageParameters<
    ValidatorType extends Validatable,
    Property extends PropertyKey[],
    Argument extends Context,
>(
    response ?: (response :  Partial<Response<ValidatorType['message']>>) => Response<any>,
    properties ?: [...Property],
    next ?: boolean
) : ValidatableResponseMessageReturn<Property, ValidatorType, Argument> ;

export function ValidatableResponseMessageParameters<
    ValidatorType extends Validatable,
    Property extends PropertyKey[],
    Argument extends Context,
>(
    response : (response :  Partial<Response<ValidatorType['message']>>) => Response<any>
        = UnprocessableEntityParameter,
    properties : Property = ['validatable'] as Property,
    next  = false
) : ValidatableResponseMessageReturn<Property, ValidatorType, Argument> {

    return function (context) {

        const value = SelectPathParameters(context, ...properties) as ValidatorType;

        if(value.valid) {

            return context;
        }

        const res = response({
            body : value.message,
        });

        FromResponse.Parameters(context, res);

        return next ? context : undefined;

    } as ValidatableResponseMessageReturn<Property, ValidatorType, Argument>;
}

export interface ValidatableResponseMessageArgument<
    Property extends PropertyKey[],
    ValidatorType extends Validatable,
    Argument extends Context
> {
    response ?: (response :  Partial<Response<ValidatorType['message']>>) => Response<any>;
    properties ?: [...Property];
    next ?: boolean;
}

export function ValidatableResponseMessageParameter<
    ValidatorType extends Validatable,
    Argument extends Context,
>() : ValidatableResponseMessageReturn<['validatable'], ValidatorType, Argument>;

export function ValidatableResponseMessageParameter<
    ValidatorType extends Validatable,
    Argument extends Context,
>(
    argument : Omit<ValidatableResponseMessageArgument<['validatable'], ValidatorType, Argument>, 'properties'>
) : ValidatableResponseMessageReturn<['validatable'], ValidatorType, Argument>;

export function ValidatableResponseMessageParameter<
    Property extends PropertyKey[],
    ValidatorType extends Validatable,
    Argument extends Context,
>(
    argument ?: ValidatableResponseMessageArgument<[...Property], ValidatorType, Argument>
) : ValidatableResponseMessageReturn<[...Property], ValidatorType, Argument>;


export function ValidatableResponseMessageParameter<
    Property extends PropertyKey[],
    ValidatorType extends Validatable,
    Argument extends Context,
>(  {
        response =  UnprocessableEntityParameter,
        properties = ['validatable'] as Property,
        next = false,
    } : ValidatableResponseMessageArgument<Property, ValidatorType, Argument> = {}
) : ValidatableResponseMessageReturn<Property, ValidatorType, Argument> {

    return ValidatableResponseMessageParameters(response, properties, next);
}

namespace ValidatableResponseMessage {

    export type  Return<
        Property extends PropertyKey[],
        ValidatorType extends Validatable,
        Argument extends Context
    > = ValidatableResponseMessageReturn<Property, ValidatorType, Argument>;
    export const  Parameters = ValidatableResponseMessageParameters;
    export type  Argument<
        Property extends PropertyKey[],
        ValidatorType extends Validatable,
        Argument extends Context
    > = ValidatableResponseMessageArgument<Property, ValidatorType, Argument>;
    export const  Parameter = ValidatableResponseMessageParameter;
}

export default ValidatableResponseMessage;
