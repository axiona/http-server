import Middleware from './middleware';
import {O} from 'ts-toolbelt';
import {SelectPathParameters} from '@alirya/object/value/value/select-path';
import Context from '../context/context';
import Stop from './stop';
import {ValidationAsyncable} from '@alirya/boolean/function/validation';
import Guard, {GuardInferExpect} from '@alirya/boolean/function/guard';


export type ValidationTypeContext<ContextType extends Context, Properties extends PropertyKey[], Value extends unknown>
    = ContextType & O.P.Record<Properties, Value>;
export type ValidationTypeMiddleware<ContextType extends Context, Properties extends PropertyKey[], Value extends unknown>
    = Middleware<ContextType, ValidationTypeContext<ContextType, Properties, Value>>;

export type ValidationReturnContextValidatable<
    ContextType extends Context,
> = Middleware<
    ContextType, ContextType
>;

export type ValidationReturnContextGuard<
    ContextType extends Context,
    ValidationType extends Guard<ContextType, Context>,
> = Middleware<
    ContextType,
    GuardInferExpect<ValidationType> & ContextType
>;

/**
 * Validate {@see Context}
 * return context when valid or execute {@param invalid} on invalid
 *
 * @param validation
 *
 * @param properties
 *
 * @param invalid
 * called if validation fail
 *
 * @param validatable
 */
export function ValidationParameters<
    ContextType extends Context,
    ValidationType extends Guard<ContextType, Context> = Guard<ContextType, Context>
>(
    validation : ValidationType,
    properties ?: [],
    invalid ?: ValidationReturnContextGuard<ContextType, ValidationType>,
) : ValidationReturnContextGuard<ContextType, ValidationType>;

export function ValidationParameters<
    Properties extends PropertyKey[],
    ValidationType extends Guard,
    ContextType extends Context = Context
>(
    validation : ValidationType,
    properties ?: [...Properties],
    invalid ?: ValidationReturnPropertiesGuard<Properties, ContextType, ValidationType>,
) : ValidationReturnPropertiesGuard<Properties, ContextType, ValidationType>;

/**
 * Validate {@see Context}
 * return context when valid or execute {@param invalid} on invalid
 *
 * @param validation
 *
 * @param properties
 *
 * @param invalid
 * called if validation fail
 *
 * @param validatable
 */
export function ValidationParameters<
    ContextType extends Context,
    ValidationType extends ValidationAsyncable<[ContextType]> = ValidationAsyncable<[ContextType]>,
>(
    validation : ValidationType,
    properties ?: [],
    invalid ?: Middleware<ContextType>,
) : ValidationReturnContextValidatable<ContextType>;



/**
 * Validate value from {@see Context} according to {@param properties} path key
 * return context when valid or execute {@param invalid} on invalid
 *
 * @param validation
 * @param invalid
 * called if validation fail
 *
 * @param properties
 * @param validatable
 */
export function ValidationParameters<
    Properties extends PropertyKey[],
    Value extends unknown,
    ContextType extends Context = Context
>(
    validation : ValidationAsyncable<[O.Path<ContextType, Properties>]>,
    properties ?: [...Properties],
    invalid ?: ValidationTypeMiddleware<ContextType, Properties, Value>,
) : ValidationReturnPropertiesValidatable<Properties, Value, ContextType>;

/**
 * concrete implementation
 *
 * @param validation
 * @param invalid
 * @param properties
 * @param valid
 */
export function ValidationParameters<
    Properties extends PropertyKey[],
    Value extends unknown,
    ContextType extends Context = Context,
>(
    validation : ValidationAsyncable<[O.Path<ContextType, Properties>]>|ValidationAsyncable<[ContextType]>,
    properties : Properties|[] = [],
    invalid : Middleware<ContextType> = Stop(),
) : ValidationReturnPropertiesValidatable<Properties, Value, ContextType> | ValidationReturnContextValidatable<ContextType> {

    const assignment : boolean = !!properties.length;

    return async function (context: ContextType & O.P.Record<Properties|[], unknown>) {

        const value = assignment ? SelectPathParameters(context, ...properties) : context;

        const result = await (validation as ValidationAsyncable<[O.Path<ContextType, Properties>]>)(value as O.Path<ContextType, Properties>);

        return result ? context : invalid(context);

    } as ValidationReturnPropertiesValidatable<Properties, Value, ContextType>;
}

export interface ValidationArgumentContextGuard<
    ContextType extends Context,
    ValidationType extends Guard<ContextType, Context>,
> {
    validation : ValidationType;
    properties ?: [];
    invalid ?: ValidationReturnContextGuard<ContextType, ValidationType>;
}

export interface ValidationArgumentPropertiesGuard<
    Properties extends PropertyKey[],
    ContextType extends Context,
    ValidationType extends Guard
> {
    validation : ValidationType;
    properties : [...Properties];
    invalid ?: ValidationReturnPropertiesGuard<Properties, ContextType, ValidationType>;
}

export interface ValidationArgumentContextValidatable<
    ContextType extends Context,
    ValidationType extends ValidationAsyncable<[ContextType]>,
> {
    validation : ValidationType;
    properties ?: [];
    invalid ?: Middleware<ContextType>;
}

export interface ValidationArgumentPropertiesValidatable<
    Properties extends PropertyKey[],
    Value extends unknown,
    ContextType extends Context,
> {
    validation : ValidationAsyncable<[O.P.Pick<ContextType, Properties>]>;
    properties : [...Properties];
    invalid ?: ValidationTypeMiddleware<ContextType, Properties, Value>;
}


/**
 * contextType version for no properties
 *
 * @param validation
 * @param invalid
 * @param validatable
 */
export function ValidationParameter<
    ContextType extends Context,
    ValidationType extends Guard<ContextType, Context> = Guard<ContextType, Context>,
>(  {
        validation,
        invalid,
    } : ValidationArgumentContextGuard<ContextType, ValidationType>,
) : ValidationReturnContextGuard<ContextType, ValidationType>;

export function ValidationParameter<
    Properties extends PropertyKey[],
    ContextType extends Context,
    ValidationType extends Guard,
>(  {
        validation,
        invalid,
        properties,
    } : ValidationArgumentPropertiesGuard<Properties, ContextType, ValidationType>,
) : ValidationReturnPropertiesGuard<Properties, ContextType, ValidationType>;

/**
 * contextType version for empty properties
 *
 * @param validation
 * @param invalid
 * @param properties
 */
export function ValidationParameter<
    ContextType extends Context,
    ValidationType extends ValidationAsyncable<[ContextType]> = ValidationAsyncable<[ContextType]>,
    Invalid extends Middleware<ContextType> = Middleware<ContextType>,
    Valid extends Middleware<ContextType> = Middleware<ContextType>,
>(  {
        validation,
        invalid,
        properties,
    } : ValidationArgumentContextValidatable<ContextType, ValidationType>,
) : Middleware<ContextType>;

/**
 * contextType version for empty properties
 *
 * @param validation
 * @param invalid
 * @param properties
 */
export function ValidationParameter<
    Properties extends PropertyKey[],
    Value extends unknown,
    ContextType extends Context = Context
>(  {
        validation,
        invalid,
        properties,
    } : ValidationArgumentPropertiesValidatable<Properties, Value, ContextType/*, Invalid, Valid*/>,
) : ValidationReturnPropertiesValidatable<Properties, Value, ContextType>;

/**
 * contextType version with properties
 *
 * @param validation
 * @param invalid
 * @param properties
 * @param validatable
 */
export function ValidationParameter<
    Properties extends PropertyKey[],
    Value extends unknown,
    ContextType extends Context,
    Invalid extends ValidationTypeMiddleware<ContextType, Properties, Value> = ValidationTypeMiddleware<ContextType, Properties, Value>,
    Valid extends ValidationTypeMiddleware<ContextType, Properties, Value> = ValidationTypeMiddleware<ContextType, Properties, Value>,
>(  {
        validation,
        invalid = Stop(),
        properties = [],
    } : ValidationArgumentPropertiesValidatable<Properties, Value, ContextType> |
        ValidationArgumentContextValidatable<ContextType,  ValidationAsyncable<[ContextType]>>
) : ValidationReturnPropertiesValidatable<Properties, Value, ContextType> | ValidationReturnContextValidatable<ContextType> {

    return ValidationParameters(validation as ValidationAsyncable<[ContextType]>, properties as [], invalid) as
        ValidationReturnPropertiesValidatable<Properties, Value, ContextType> | ValidationReturnContextValidatable<ContextType>;
}

export type ValidationReturnPropertiesValidatable<
    Properties extends PropertyKey[],
    Value extends unknown,
    ContextType extends Context = Context
> = Middleware<
    ContextType,
    ContextType  & O.P.Record<Properties, Value>
    >;


export type ValidationReturnPropertiesGuard<
    Properties extends PropertyKey[],
    ContextType extends Context,
    ValidationType extends Guard,
> = Middleware<
    ContextType,
    O.P.Omit<ContextType, Properties> & O.P.Record<Properties, GuardInferExpect<ValidationType>>
>;


namespace Validation {

    export const Parameters = ValidationParameters;
    export const Parameter = ValidationParameter;

    export type ContextTypePropertiesGuard<
        ContextType extends Context,
        Properties extends PropertyKey[],
        ValidationType extends Guard,
    > = ValidationArgumentPropertiesGuard<Properties, ContextType, ValidationType>;

    export type ContextTypeContextGuard<
        ContextType extends Context,
        ValidationType extends Guard<ContextType, Context>,
    > = ValidationArgumentContextGuard<ContextType, ValidationType>;

    export type ContextTypePropertiesValidatable<
        Properties extends PropertyKey[],
        Value extends unknown,
        ContextType extends Context,
    > = ValidationArgumentPropertiesValidatable<Properties, Value, ContextType>;

    export type ContextTypeContextValidatable<
        ContextType extends Context,
        ValidationType extends ValidationAsyncable<[ContextType]>,
    > = ValidationArgumentContextValidatable<ContextType, ValidationType>;

    export type ReturnProperties<
        Properties extends PropertyKey[],
        Value extends unknown,
        ContextType extends Context = Context
    > = ValidationReturnPropertiesValidatable<Properties, Value, ContextType>;

    export type ReturnContext<
        ContextType extends Context,
    > = ValidationReturnContextValidatable<ContextType>;

    export type TypeContext<
        ContextType extends Context,
        Properties extends PropertyKey[],
        Value extends unknown
    > = ContextType & O.P.Record<Properties, Value>;

    export type TypeMiddleware<
        ContextType extends Context,
        Properties extends PropertyKey[],
        Value extends unknown
    > = Middleware<ContextType, ValidationTypeContext<ContextType, Properties, Value>>;
}
export default  Validation;
