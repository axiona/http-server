import Middleware from './middleware';
import {O} from 'ts-toolbelt';
import PickDeepParameters from "@alirya/object/value/value/select-path-parameters";
import SetPathParameters from "@alirya/object/set-path-parameters";
import Context from '../context/context';
import Stop from './stop';
import ValidationInterface from '../../../boolean/dist/function/validation';
import Guard, {GuardInferAllow, GuardInferExpect, GuardInferValue} from '../../../boolean/dist/function/guard';
import BindToServer from '../router/append-server';
import Router from '../router/standard';
import Standard from '../server/standard';



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
    ValidationType extends Guard<ContextType, Context> = Guard<ContextType, Context>,
    Invalid extends ValidationReturnContextGuard<ContextType, ValidationType> = ValidationReturnContextGuard<ContextType, ValidationType>
>(
    validation : ValidationType,
    properties ?: [],
    invalid ?: Invalid,
) : ValidationReturnContextGuard<ContextType, ValidationType>;

export function ValidationParameters<
    Properties extends PropertyKey[],
    ValidationType extends Guard,
    ContextType extends Context = Context,
    Invalid extends ValidationReturnPropertiesGuard<Properties, ContextType, ValidationType> = ValidationReturnPropertiesGuard<Properties, ContextType, ValidationType>
>(
    validation : ValidationType,
    properties ?: [...Properties],
    invalid ?: Invalid,
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
    ValidationType extends ValidationInterface<[ContextType]> = ValidationInterface<[ContextType]>,
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
    ContextType extends Context = Context,
    Invalid extends ValidationTypeMiddleware<ContextType, Properties, Value> = ValidationTypeMiddleware<ContextType, Properties, Value>
>(
    validation : ValidationInterface<[O.P.Pick<ContextType, Properties>]>,
    properties ?: [...Properties],
    invalid ?: Invalid,
) : ValidationReturnPropertiesValidatable<Properties, Value, ContextType>;

/**
 * concrete implementation
 *
 * @param validation
 * @param invalid
 * @param properties
 * @param validatable
 */
export function ValidationParameters<
    Properties extends PropertyKey[],
    Value extends unknown,
    ContextType extends Context = Context,
>(
    validation : ValidationInterface<[O.P.Pick<ContextType, Properties>]>|ValidationInterface<[ContextType]>,
    properties : Properties|[] = [],
    invalid : Middleware<ContextType> = Stop,
) : ValidationReturnPropertiesValidatable<Properties, Value, ContextType> | ValidationReturnContextValidatable<ContextType> {

    const assignment : boolean = !!properties.length;

    return function (context: ContextType & O.P.Record<Properties|[], unknown>) {

        const value = assignment ? PickDeepParameters(context, ...properties) : context;

        const result = validation(value as O.P.Pick<ContextType, Properties>);

        if(result) {

            return context;
        }

        return invalid(context as ContextType);

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
    ValidationType extends Guard,
    Invalid extends ValidationReturnPropertiesGuard<Properties, ContextType, ValidationType>
> {
    validation : ValidationType;
    properties : [...Properties];
    invalid ?: Invalid;
}

export interface ValidationArgumentContextValidatable<
    ContextType extends Context,
    ValidationType extends ValidationInterface<[ContextType]>,
    Invalid extends Middleware<ContextType>
> {
    validation : ValidationType;
    properties ?: [];
    invalid ?: Invalid;
}

export interface ValidationArgumentPropertiesValidatable<
    Properties extends PropertyKey[],
    Value extends unknown,
    ContextType extends Context,
    Invalid extends ValidationTypeMiddleware<ContextType, Properties, Value>
> {
    validation : ValidationInterface<[O.P.Pick<ContextType, Properties>]>;
    properties : [...Properties];
    invalid ?: Invalid;
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
    Invalid extends ValidationReturnPropertiesGuard<Properties, ContextType, ValidationType> = ValidationReturnPropertiesGuard<Properties, ContextType, ValidationType>
>(  {
        validation,
        invalid,
        properties,
    } : ValidationArgumentPropertiesGuard<Properties, ContextType, ValidationType, Invalid>,
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
    ValidationType extends ValidationInterface<[ContextType]> = ValidationInterface<[ContextType]>,
    M extends Middleware<ContextType> = Middleware<ContextType>
>(  {
        validation,
        invalid,
        properties,
    } : ValidationArgumentContextValidatable<ContextType, ValidationType, M>,
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
    ContextType extends Context = Context,
    Invalid extends ValidationTypeMiddleware<ContextType, Properties, Value> = ValidationTypeMiddleware<ContextType, Properties, Value>
>(  {
        validation,
        invalid,
        properties,
    } : ValidationArgumentPropertiesValidatable<Properties, Value, ContextType, Invalid>,
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
>(  {
        validation,
        invalid = Stop,
        properties = [],
    } : ValidationArgumentPropertiesValidatable<Properties, Value, ContextType, Invalid> |
        ValidationArgumentContextValidatable<ContextType,  ValidationInterface<[ContextType]>,
Middleware<ContextType>>
) : ValidationReturnPropertiesValidatable<Properties, Value, ContextType> | ValidationReturnContextValidatable<ContextType> {

    return ValidationParameters(validation as ValidationInterface<[ContextType]>, properties as [], invalid) as
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
        Invalid extends ValidationReturnPropertiesGuard<Properties, ContextType, ValidationType>
    > = ValidationArgumentPropertiesGuard<Properties, ContextType, ValidationType, Invalid>;

    export type ContextTypeContextGuard<
        ContextType extends Context,
        ValidationType extends Guard<ContextType, Context>,
    > = ValidationArgumentContextGuard<ContextType, ValidationType>;

    export type ContextTypePropertiesValidatable<
        Properties extends PropertyKey[],
        Value extends unknown,
        ContextType extends Context,
        Invalid extends ValidationTypeMiddleware<ContextType, Properties, Value>
    > = ValidationArgumentPropertiesValidatable<Properties, Value, ContextType, Invalid>;

    export type ContextTypeContextValidatable<
        ContextType extends Context,
        ValidationType extends ValidationInterface<[ContextType]>,
        Invalid extends Middleware<ContextType>
    > = ValidationArgumentContextValidatable<ContextType, ValidationType, Invalid>;

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
