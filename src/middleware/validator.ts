import Validator from '@alirya/validator/simple.js';
import InferValidatable from '@alirya/validator/validatable/infer-static.js';
import InferMatch from '@alirya/validator/validatable/match/infer.js';
import Middleware, {MiddlewareReturn} from './middleware.js';
import {O} from 'ts-toolbelt';
import {SelectPathParameters} from '@alirya/object/value/value/select-path.js';
import { SetPathParameters } from '@alirya/object/set-path.js';
import Context from '../context/context.js';
import Callable from "@alirya/function/callable.js";
import InferStatic from "@alirya/validator/validatable/infer-static.js";
import {SetResponseParameters} from '../context/set-response.js';
import {BadRequestParameters} from '@alirya/http/response/bad-request.js';

export type ValidatorPreviousContext<Properties extends PropertyKey[]> = Context & O.P.Record<Properties, unknown>;
export type ValidatorTypePropertiesNext<
    Argument extends Context,
    Properties extends PropertyKey[],
    ValidatorType extends Validator<O.Path<Argument, Properties>>
    > = O.P.Omit<Argument, Properties> & O.P.Record<Properties, InferMatch<ValidatorType>>;

export type ValidatorTypeProperties<
    Argument extends Context,
    Properties extends PropertyKey[],
    ValidatorType extends Validator<O.Path<Argument, Properties>>,
    ValidatableKey extends PropertyKey[]
> = Middleware<
    Argument,
    ValidatorTypePropertiesNext<Argument, Properties, ValidatorType> & O.P.Record<ValidatableKey, InferValidatable<ValidatorType>>
>;

export type ValidatorTypeContext<
    Argument extends Context,
    ValidatorType extends Validator<Argument, Context>,
    ValidatableKey extends PropertyKey[]
> = Middleware<
    Argument,
    ValidatorTypeContextNext<Argument, ValidatorType, ValidatableKey>
>;

export type ValidatorTypeContextNext<
    Argument extends Context,
    ValidatorType extends Validator<Argument, Context>,
    ValidatableKey extends PropertyKey[]
> = Argument & InferMatch<ValidatorType> & O.P.Record<ValidatableKey, InferValidatable<ValidatorType>>;

export interface ValidatorArgumentProperties<
    Properties extends PropertyKey[],
    ContextType extends ValidatorPreviousContext<Properties>|Context,
    ValidatorType extends Validator<O.Path<ContextType, Properties>>,
    ValidatableKey extends PropertyKey[]
> {
    validator : ValidatorType;
    invalid ?: Callable<[ContextType, InferStatic<ValidatorType>],  MiddlewareReturn</*ValidatorTypePropertiesNext<*/ContextType/*, Properties, ValidatorType>*/>>;
    replace ?: boolean;
    properties : [...Properties];
    validatable ?: [...ValidatableKey];
}

export interface ValidatorArgumentContext<
    ContextType extends Context,
    ValidatorType extends Validator<ContextType, Context>,
    ValidatableKey extends PropertyKey[],
    Invalid extends ValidatorTypeContextNext<ContextType, ValidatorType, ValidatableKey>,
> {
    validator : ValidatorType;
    invalid ?: Callable<[ContextType, InferStatic<ValidatorType>], MiddlewareReturn<Invalid>>;
    replace ?: boolean;
    properties ?: [];
    validatable ?: [...ValidatableKey];
}


/**
 * argument version for no properties
 *
 * @param validator
 * @param invalid
 * @param replace
 * @param validatable
 */
export function ValidatorParameter<
    ContextType extends Context = Context,
    ValidatorType extends Validator<ContextType, Context> = Validator<ContextType, Context>,
    ValidatableKey extends PropertyKey[] = ['validatable'],
    Invalid extends ValidatorTypeContextNext<ContextType, ValidatorType, ValidatableKey> = ValidatorTypeContextNext<ContextType, ValidatorType, ValidatableKey>,
>(  {
        validator,
        invalid,
        replace,
        validatable,
    } : ValidatorArgumentContext<ContextType, ValidatorType, ValidatableKey, Invalid/*, Valid*/>,
) : ValidatorTypeContext<ContextType, ValidatorType, ValidatableKey>;

/**
 * argument version for empty properties
 *
 * @param validator
 * @param invalid
 * @param replace
 * @param properties
 * @param validatable
 */
export function ValidatorParameter<
    Properties extends PropertyKey[],
    ContextType extends ValidatorPreviousContext<Properties> = ValidatorPreviousContext<Properties>,
    ValidatorType extends Validator<O.Path<ContextType, Properties>> = Validator<O.Path<ContextType, Properties>>,
    ValidatableKey extends PropertyKey[] = ['validatable']
>(  {
        validator,
        invalid,
        replace,
        properties,
        validatable,
    } : ValidatorArgumentProperties<Properties, ContextType, ValidatorType, ValidatableKey>,
) : ValidatorTypeProperties<ContextType, Properties, ValidatorType, ValidatableKey>;

/**
 * argument version for empty properties
 *
 * @param validator
 * @param invalid
 * @param replace
 * @param properties
 * @param validatable
 */
export function ValidatorParameter<
    Properties extends PropertyKey[],
    ContextType extends ValidatorPreviousContext<Properties> = ValidatorPreviousContext<Properties>,
    ValidatorType extends Validator<O.Path<ContextType, Properties>> = Validator<O.Path<ContextType, Properties>>,
    ValidatableKey extends PropertyKey[] = ['validatable']
>(  {
        validator,
        invalid,
        replace,
        properties,
        validatable,
    } : ValidatorArgumentProperties<Properties, ContextType, ValidatorType, ValidatableKey>,
) : ValidatorTypeProperties<ContextType, Properties, ValidatorType, ValidatableKey>;

/**
 * argument version with properties
 *
 * @param validator
 * @param invalid
 * @param replace
 * @param properties
 * @param validatable
 */
export function ValidatorParameter<
    Properties extends PropertyKey[],
    ContextType extends ValidatorPreviousContext<Properties>|Context,
    ValidatorType extends Validator<O.Path<ContextType, Properties>>|Validator<ContextType>,
    ValidatableKey extends PropertyKey[] = ['validatable'],
    Invalid extends ValidatorTypeContextNext<ContextType, Validator<ContextType>, ValidatableKey>
        = ValidatorTypeContextNext<ContextType, Validator<ContextType>, ValidatableKey>,
>(  {
        validator,
        invalid,
        replace = true,
        properties = [] as any ,
        validatable  = ['validatable'],
    } : ValidatorArgumentProperties<Properties, ContextType, Validator<O.Path<ContextType, Properties>>, ValidatableKey|['validatable']> |
        ValidatorArgumentContext<ContextType, Validator<ContextType>, ValidatableKey|['validatable'], any>
) : ValidatorTypeProperties<ContextType, Properties, Validator<O.Path<ContextType, Properties>>, ValidatableKey/*|['validatable']*/> /*| ValidatorTypeContext<ContextType, ValidatorType, ValidatableKey>*/ {

    // TODO FIX ANY TYPE
    return ValidatorParameters(validator as any, properties as any, invalid as any/* as any*/, /*valid as any,*/ replace as any , validatable as any/* as ValidatableKey|['validatable']*/) as any /*as
        any as ValidatorTypeProperties<ContextType, Properties, ValidatorType, ValidatableKey>*/ /*| ValidatorTypeContext<ContextType, ValidatorType, ValidatableKey>*/;
}


/**
 * Validate {@see Context}
 * return context when valid or execute {@param invalid} on invalid
 *
 * @param validator
 *
 * @param properties
 *
 * @param invalid
 * called if validation fail
 *
 * @param replace
 * replace returned context from value from {@see Validator}
 *
 * @param validatable
 */
export function ValidatorParameters<
    ContextType extends Context = Context,
    ValidatorType extends Validator<ContextType, Context> = Validator<ContextType, Context>,
    ValidatableKey extends PropertyKey[] = ['validatable'],
    Invalid extends ValidatorTypeContextNext<ContextType, ValidatorType, ValidatableKey> = ValidatorTypeContextNext<ContextType, ValidatorType, ValidatableKey>,
>(
    validator : ValidatorType,
    properties ?: [],
    invalid ?: Callable<[ContextType, InferStatic<ValidatorType>], MiddlewareReturn<Invalid>>,
    replace ?: boolean,
    validatable ?: [...ValidatableKey],
) : ValidatorTypeContext<ContextType, ValidatorType, ValidatableKey>;

/**
 * Validate value from {@see Context} according to {@param properties} path key
 * return context when valid or execute {@param invalid} on invalid
 *
 * @param validator
 * @param invalid
 * called if validation fail
 *
 * @param replace
 * if valid replace value {@see Context} according to {@param properties} path key
 *
 * @param properties
 * @param validatable
 */
export function ValidatorParameters<
    Properties extends PropertyKey[],
    ContextType extends ValidatorPreviousContext<Properties> = ValidatorPreviousContext<Properties>,
    ValidatorType extends Validator<O.Path<ContextType, Properties>> = Validator<O.Path<ContextType, Properties>>,
    ValidatableKey extends PropertyKey[] = ['validatable']
>(
    validator : ValidatorType,
    properties ?: [...Properties],
    invalid ?: Callable<[ContextType, InferStatic<ValidatorType>], MiddlewareReturn<ContextType>>,
    replace ?: boolean,
    validatable ?: [...ValidatableKey],
) : ValidatorTypeProperties<ContextType, Properties, ValidatorType, ValidatableKey>;

/**
 * concrete implementation
 *
 * @param validator
 * @param invalid
 * @param replace
 * @param properties
 * @param validatable
 */
export function ValidatorParameters<
    Properties extends PropertyKey[],
    ContextType extends ValidatorPreviousContext<Properties>|Context,
    ValidatorType extends Validator<O.Path<ContextType, Properties>>/*|Validator<ContextType>*/,
    ValidatableKey extends PropertyKey[]
>(
    validator : ValidatorType,
    properties : Properties|[] = [],
    invalid : Callable<[ContextType, InferStatic<ValidatorType>], MiddlewareReturn<ContextType>> = (context, validatable) => {
        SetResponseParameters(context, BadRequestParameters(validatable.message));
    },
    replace  = true,
    validatable : ValidatableKey|['validatable'] = ['validatable'],
) : ValidatorTypeProperties<ContextType, Properties, ValidatorType, ValidatableKey> /*| ValidatorTypeContext<ContextType, ValidatorType, ValidatableKey>*/ {

    const assignment  = !!properties.length;

    return function (context: ValidatorPreviousContext<Properties|[]>) {

        const value = assignment ? SelectPathParameters(context, ...properties) : context;

        const result = (validator as Validator)(value);

        context = assignment ? SetPathParameters(context as Context, result, ...validatable) as ValidatorPreviousContext<Properties|[]> : context;

        if(result.valid) {

            if(replace) {

                SetPathParameters(context as any, result.value, ...properties);
            }

            return context;

        } else {

            return invalid(context as ContextType, result as InferStatic<ValidatorType>) as ContextType;
        }

    } as ValidatorTypeProperties<ContextType, Properties, ValidatorType, ValidatableKey>;
}


namespace Validator {

    export const Parameters = ValidatorParameters;
    export const Parameter = ValidatorParameter;
    export type ArgumentProperties<
        Properties extends PropertyKey[],
        ContextType extends ValidatorPreviousContext<Properties>,
        ValidatorType extends Validator<O.Path<ContextType, Properties>>,
        ValidatableKey extends PropertyKey[]
    > = ValidatorArgumentProperties<Properties, ContextType, ValidatorType, ValidatableKey>;

    export type ArgumentContext<
        ContextType extends Context,
        ValidatorType extends Validator<ContextType>,
        ValidatableKey extends PropertyKey[],
        Invalid extends ValidatorTypeContextNext<ContextType, ValidatorType, ValidatableKey>,
    > = ValidatorArgumentContext<ContextType, ValidatorType, ValidatableKey, Invalid/*, Valid*/>;

    export type ReturnProperties<
        Argument extends Context,
        Properties extends PropertyKey[],
        ValidatorType extends Validator<O.Path<Argument, Properties>>,
        ValidatableKey extends PropertyKey[]
    > = ValidatorTypeProperties<Argument, Properties, ValidatorType, ValidatableKey>;

    export type ReturnContext<
        Argument extends Context,
        ValidatorType extends Validator<Argument>,
        ValidatableKey extends PropertyKey[]
    > = ValidatorTypeContext<Argument, ValidatorType, ValidatableKey>;

    export type TypeContext<Properties extends PropertyKey[]> = ValidatorPreviousContext<Properties>;
}
export default  Validator;
