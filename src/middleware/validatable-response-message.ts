import {O} from "ts-toolbelt";
import Middleware from "./middleware";
import Validatable from "@alirya/validator/validatable/validatable";
import Response from "@alirya/http/response/response";
import UnprocessableEntityParameter from "@alirya/http/response/unprocessable-entity-parameter";
import Context from '../context/context';
import PickDeepParameters from '../../../object/dist/value/value/select-path-parameters';
import FromResponse from '../context/from-response';
import Return from './return/return';
//
// export interface ValidatableResponseMessageReturn<
//     Property extends PropertyKey[],
//     ValidatorType extends Validatable,
//     Argument extends Context ,
// > extends Middleware<
//     Argument & O.P.Record<Property, ValidatorType>,
//     O.P.Record<Property, ValidatorType> & O.P.Update<Argument, ['response', 'body'], ValidatorType['message']>
// > {}

export type ValidatableResponseMessageReturn<
    Property extends PropertyKey[],
    ValidatorType extends Validatable,
    Argument extends Context ,
> = Middleware<
    Argument & O.P.Record<Property, ValidatorType>,
    O.P.Record<Property, ValidatorType> & O.P.Update<Argument, ['response', 'body'], ValidatorType['message']>
> ;

// export interface ValidatableResponseMessageReturn<
//     Property extends PropertyKey[],
//     ValidatorTypez extends Validatable,
//     Argument extends Context,
//     // Message = unknown
// > /*extends Middleware<
//     Argument & O.P.Record<Property, ValidatorType>,
//     O.P.Record<Property, ValidatorType> & O.P.Update<Argument, ['response', 'body'], ValidatorType['message']>
// >*/ {
//     <A extends Argument & O.P.Record<Property, ValidatorTypez>>(
//         context: A
//     ) : /*Return<O.P.Record<Property, ValidatorType> &*/ O.P.Update<A, ['response', 'body'], ValidatorTypez['message']>;
// }

//
// export function ValidatableResponseMessageParameters<
//     ValidatorType extends Validatable,
//     Argument extends Context = Context,
// >() : ValidatableResponseMessageReturn<['validatable'], ValidatorType, Argument>;


// export function ValidatableResponseMessageParameters<
//     ValidatorType extends Validatable,
//     Argument extends Context,
// >(
//     response : (response :  Partial<Response<number, string, {}, ValidatorType['message']>>) => Response<number, string, Record<string, string>, any>,
// ) : ValidatableResponseMessageReturn<['validatable'], ValidatorType, Argument>;
//

// export function ValidatableResponseMessageParameters<
//     ValidatorType extends Validatable,
//     Property extends PropertyKey[] = ['validatable'],
//     Argument extends Context = Context,
// >(
//     response ?: ((response :  Partial<Response<number, string, {}, ValidatorType['message']>>) => Response<number, string, Record<string, string>, any>),
//     properties ?: [...Property],
// ) : ValidatableResponseMessageReturn<Property, ValidatorType, Argument>;

export function ValidatableResponseMessageParameters<
    ValidatorType extends Validatable,
    Property extends PropertyKey[],
    Argument extends Context,
>(
    response ?: (response :  Partial<Response<number, string, {}, ValidatorType['message']>>) => Response<number, string, Record<string, string>, any>,
    properties ?: [...Property],
    next ?: boolean
) : ValidatableResponseMessageReturn<Property, ValidatorType, Argument> ;

// export function ValidatableResponseMessageParameters<
//     Property extends PropertyKey[] = ['validatable'],
//     ValidatorType extends Validatable = Validatable,
//     Argument extends Context = Context,
// >(
//     response ?: (response :  Partial<Response<number, string, {}, ValidatorType['message']>>) => Response<number, string, Record<string, string>, any>,
//     properties ?: [...Property],
//     next ?: boolean
// ) : ValidatableResponseMessageReturn<[...Property], ValidatorType, Argument> ;



export function ValidatableResponseMessageParameters<
    ValidatorType extends Validatable,
    Property extends PropertyKey[],
    Argument extends Context,
>(
    response : (response :  Partial<Response<number, string, {}, ValidatorType['message']>>) => Response<number, string, Record<string, string>, any>
        = UnprocessableEntityParameter,
    properties : Property = ['validatable'] as Property,
    next : boolean = false
) : ValidatableResponseMessageReturn<Property, ValidatorType, Argument> {

    return function (context) {

        const value = PickDeepParameters(context, ...properties) as ValidatorType;

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
    response ?: (response :  Partial<Response<number, string, {}, ValidatorType['message']>>) => Response<number, string, Record<string, string>, any>;
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
