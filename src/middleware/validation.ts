import Middleware from './middleware';
import {O} from 'ts-toolbelt';
import {SelectPathParameters} from '@alirya/object/value/value/select-path';
import Context from '../context/context';
import Stop from './stop';
import ValidationInterface from '@alirya/boolean/function/validation';
import Guard, {GuardInferExpect} from '@alirya/boolean/function/guard';
// import Next from "./next";
// import {ConditionalCallParameters} from "@alirya/function/conditional-call";


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
    // Invalid extends ValidationReturnContextGuard<ContextType, ValidationType> = ValidationReturnContextGuard<ContextType, ValidationType>,
    // Valid extends ValidationReturnContextGuard<ContextType, ValidationType> = ValidationReturnContextGuard<ContextType, ValidationType>,
>(
    validation : ValidationType,
    properties ?: [],
    // invalid ?: Invalid,
    invalid ?: ValidationReturnContextGuard<ContextType, ValidationType>,
    // valid ?: Valid,
) : ValidationReturnContextGuard<ContextType, ValidationType>;

export function ValidationParameters<
    Properties extends PropertyKey[],
    ValidationType extends Guard,
    ContextType extends Context = Context,
    // Invalid extends ValidationReturnPropertiesGuard<Properties, ContextType, ValidationType> = ValidationReturnPropertiesGuard<Properties, ContextType, ValidationType>,
    // Valid extends ValidationReturnPropertiesGuard<Properties, ContextType, ValidationType> = ValidationReturnPropertiesGuard<Properties, ContextType, ValidationType>
>(
    validation : ValidationType,
    properties ?: [...Properties],
    // invalid ?: Invalid,
    invalid ?: ValidationReturnPropertiesGuard<Properties, ContextType, ValidationType>,
    // valid ?: Valid,
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
    // valid ?: Middleware<ContextType>,
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
    // Invalid extends ValidationTypeMiddleware<ContextType, Properties, Value> = ValidationTypeMiddleware<ContextType, Properties, Value>,
    // Valid extends ValidationTypeMiddleware<ContextType, Properties, Value> = ValidationTypeMiddleware<ContextType, Properties, Value>
>(
    validation : ValidationInterface<[O.Path<ContextType, Properties>]>,
    properties ?: [...Properties],
    // invalid ?: Invalid,
    invalid ?: ValidationTypeMiddleware<ContextType, Properties, Value>,
    // valid ?: Valid,
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
    validation : ValidationInterface<[O.Path<ContextType, Properties>]>|ValidationInterface<[ContextType]>,
    properties : Properties|[] = [],
    invalid : Middleware<ContextType> = Stop(),
    // valid : Middleware<ContextType> = Next(),
) : ValidationReturnPropertiesValidatable<Properties, Value, ContextType> | ValidationReturnContextValidatable<ContextType> {

    const assignment : boolean = !!properties.length;

    return function (context: ContextType & O.P.Record<Properties|[], unknown>) {

        const value = assignment ? SelectPathParameters(context, ...properties) : context;

        const result = (validation as ValidationInterface<[O.Path<ContextType, Properties>]>)(value as O.Path<ContextType, Properties>);

        if(!result) {

            return invalid(context);
        }

        return context;

        // return ConditionalCallParameters(result, valid, invalid, context as ContextType);

    } as ValidationReturnPropertiesValidatable<Properties, Value, ContextType>;
}

export interface ValidationArgumentContextGuard<
    ContextType extends Context,
    ValidationType extends Guard<ContextType, Context>,
> {
    validation : ValidationType;
    properties ?: [];
    invalid ?: ValidationReturnContextGuard<ContextType, ValidationType>;
    // valid ?: ValidationReturnContextGuard<ContextType, ValidationType>;
}

export interface ValidationArgumentPropertiesGuard<
    Properties extends PropertyKey[],
    ContextType extends Context,
    ValidationType extends Guard,
    // Invalid extends ValidationReturnPropertiesGuard<Properties, ContextType, ValidationType>,
    // Valid extends ValidationReturnPropertiesGuard<Properties, ContextType, ValidationType>,
> {
    validation : ValidationType;
    properties : [...Properties];
    // valid ?: Valid;
    // invalid ?: Invalid;
    invalid ?: ValidationReturnPropertiesGuard<Properties, ContextType, ValidationType>;
}

export interface ValidationArgumentContextValidatable<
    ContextType extends Context,
    ValidationType extends ValidationInterface<[ContextType]>,
    // Invalid extends Middleware<ContextType>,
    // Valid extends Middleware<ContextType>,
> {
    validation : ValidationType;
    properties ?: [];
    // invalid ?: Invalid;
    invalid ?: Middleware<ContextType>;
    // valid ?: Valid;
}

export interface ValidationArgumentPropertiesValidatable<
    Properties extends PropertyKey[],
    Value extends unknown,
    ContextType extends Context,
    // Invalid extends ValidationTypeMiddleware<ContextType, Properties, Value>,
    // Valid extends ValidationTypeMiddleware<ContextType, Properties, Value>,
> {
    validation : ValidationInterface<[O.P.Pick<ContextType, Properties>]>;
    properties : [...Properties];
    invalid ?: ValidationTypeMiddleware<ContextType, Properties, Value>;
    // invalid ?: Invalid;
    // valid ?: Valid;
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
        // valid,
    } : ValidationArgumentContextGuard<ContextType, ValidationType>,
) : ValidationReturnContextGuard<ContextType, ValidationType>;

export function ValidationParameter<
    Properties extends PropertyKey[],
    ContextType extends Context,
    ValidationType extends Guard,
    // Invalid extends ValidationReturnPropertiesGuard<Properties, ContextType, ValidationType> = ValidationReturnPropertiesGuard<Properties, ContextType, ValidationType>,
    // Valid extends ValidationReturnPropertiesGuard<Properties, ContextType, ValidationType> = ValidationReturnPropertiesGuard<Properties, ContextType, ValidationType>,
>(  {
        validation,
        invalid,
        // valid,
        properties,
    } : ValidationArgumentPropertiesGuard<Properties, ContextType, ValidationType/*, Invalid, Valid*/>,
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
    Invalid extends Middleware<ContextType> = Middleware<ContextType>,
    Valid extends Middleware<ContextType> = Middleware<ContextType>,
>(  {
        validation,
        invalid,
        // valid,
        properties,
    } : ValidationArgumentContextValidatable<ContextType, ValidationType/*, Invalid, Valid*/>,
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
    // Invalid extends ValidationTypeMiddleware<ContextType, Properties, Value> = ValidationTypeMiddleware<ContextType, Properties, Value>,
    // Valid extends ValidationTypeMiddleware<ContextType, Properties, Value> = ValidationTypeMiddleware<ContextType, Properties, Value>,
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
    } : ValidationArgumentPropertiesValidatable<Properties, Value, ContextType/*, Invalid, Valid*/> |
        ValidationArgumentContextValidatable<ContextType,  ValidationInterface<[ContextType]>/*, Middleware<ContextType>, Middleware<ContextType>*/>
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
        // Invalid extends ValidationReturnPropertiesGuard<Properties, ContextType, ValidationType>,
        // Valid extends ValidationReturnPropertiesGuard<Properties, ContextType, ValidationType>,
    > = ValidationArgumentPropertiesGuard<Properties, ContextType, ValidationType/*, Invalid, Valid*/>;

    export type ContextTypeContextGuard<
        ContextType extends Context,
        ValidationType extends Guard<ContextType, Context>,
    > = ValidationArgumentContextGuard<ContextType, ValidationType>;

    export type ContextTypePropertiesValidatable<
        Properties extends PropertyKey[],
        Value extends unknown,
        ContextType extends Context,
        // Invalid extends ValidationTypeMiddleware<ContextType, Properties, Value>,
        // Valid extends ValidationTypeMiddleware<ContextType, Properties, Value>,
    > = ValidationArgumentPropertiesValidatable<Properties, Value, ContextType/*, Invalid, Valid*/>;

    export type ContextTypeContextValidatable<
        ContextType extends Context,
        ValidationType extends ValidationInterface<[ContextType]>,
        // Invalid extends Middleware<ContextType>,
        // Valid extends Middleware<ContextType>,
    > = ValidationArgumentContextValidatable<ContextType, ValidationType/*, Invalid, Valid*/>;

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
