import Validator from '@alirya/validator/simple';
import InferValidatable from '@alirya/validator/validatable/infer-static';
import InferMatch from '@alirya/validator/validatable/match/infer';
import Middleware from './middleware';
import {O} from 'ts-toolbelt';
import PickDeepParameters from "@alirya/object/value/value/select-path-parameters";
import SetPathParameters from "@alirya/object/set-path-parameters";
import Context from '../context/context';
import Stop from './stop';

export type ValidatorTypeContext<Properties extends PropertyKey[]> = Context & O.P.Record<Properties, unknown>;
export type ValidatorTypeReturnContext<
    Argument extends Context,
    Properties extends PropertyKey[],
    ValidatorType extends Validator<O.P.Pick<Argument, Properties>>
    > = O.P.Omit<Argument, Properties> & O.P.Record<Properties, InferMatch<ValidatorType>>;

export type ValidatorReturnProperties<
    Argument extends Context,
    Properties extends PropertyKey[],
    ValidatorType extends Validator<O.P.Pick<Argument, Properties>>,
    ValidatableKey extends PropertyKey[]
> = Middleware<
    Argument,
    ValidatorTypeReturnContext<Argument, Properties, ValidatorType> & O.P.Record<ValidatableKey, InferValidatable<ValidatorType>>
>;

export type ValidatorReturnContext<
    Argument extends Context,
    ValidatorType extends Validator<Argument>,
    ValidatableKey extends PropertyKey[]
> = Middleware<
    Argument,
    InferMatch<ValidatorType> & O.P.Record<ValidatableKey, InferValidatable<ValidatorType>>
>;

export interface ValidatorArgumentProperties<
    Properties extends PropertyKey[],
    ContextType extends ValidatorTypeContext<Properties>,
    ValidatorType extends Validator<O.P.Pick<ContextType, Properties>>,
    ValidatableKey extends PropertyKey[]
> {
    validator : ValidatorType;
    // valid ?: Middleware<ContextType>,
    invalid ?: Middleware<ContextType, ValidatorTypeReturnContext<ContextType, Properties, ValidatorType>>;
    replace ?: boolean;
    properties : [...Properties];
    validatable ?: [...ValidatableKey];
}

export interface ValidatorArgumentContext<
    ContextType extends Context,
    ValidatorType extends Validator<ContextType>,
    ValidatableKey extends PropertyKey[]
> {
    validator : ValidatorType;
    // valid ?: Middleware<ContextType>,
    invalid ?: Middleware<ContextType, InferMatch<ValidatorType>>;
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
    ValidatorType extends Validator<ContextType> = Validator<ContextType>,
    ValidatableKey extends PropertyKey[] = ['validatable']
>(  {
        validator,
        invalid,
        replace,
        validatable,
    } : ValidatorArgumentContext<ContextType, ValidatorType, ValidatableKey>,
) : ValidatorReturnContext<ContextType, ValidatorType, ValidatableKey>;

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
    ContextType extends ValidatorTypeContext<Properties> = ValidatorTypeContext<Properties>,
    ValidatorType extends Validator<O.P.Pick<ContextType, Properties>> = Validator<O.P.Pick<ContextType, Properties>>,
    ValidatableKey extends PropertyKey[] = ['validatable']
>(  {
        validator,
        invalid,
        replace,
        properties,
        validatable,
    } : ValidatorArgumentProperties<Properties, ContextType, ValidatorType, ValidatableKey>,
) : ValidatorReturnProperties<ContextType, Properties, ValidatorType, ValidatableKey>;

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
    ContextType extends ValidatorTypeContext<Properties> = ValidatorTypeContext<Properties>,
    ValidatorType extends Validator<O.P.Pick<ContextType, Properties>> = Validator<O.P.Pick<ContextType, Properties>>,
    ValidatableKey extends PropertyKey[] = ['validatable']
>(  {
        validator,
        invalid,
        replace,
        properties,
        validatable,
    } : ValidatorArgumentProperties<Properties, ContextType, ValidatorType, ValidatableKey>,
) : ValidatorReturnProperties<ContextType, Properties, ValidatorType, ValidatableKey>;

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
    ContextType extends ValidatorTypeContext<Properties>,
    ValidatorType extends Validator<O.P.Pick<ContextType, Properties>>|Validator<ContextType>,
    ValidatableKey extends PropertyKey[]
>(  {
        validator,
        invalid = Stop,
        replace = true,
        properties = [],
        validatable = ['validatable'],
    } : ValidatorArgumentProperties<Properties, ContextType, ValidatorType, ValidatableKey|['validatable']> |
        ValidatorArgumentContext<ContextType, ValidatorType, ValidatableKey|['validatable']>
) : ValidatorReturnProperties<ContextType, Properties, ValidatorType, ValidatableKey> | ValidatorReturnContext<ContextType, ValidatorType, ValidatableKey> {

    return ValidatorParameters(validator, properties as [], invalid as Middleware, replace, validatable as ValidatableKey|['validatable']) as
        ValidatorReturnProperties<ContextType, Properties, ValidatorType, ValidatableKey> | ValidatorReturnContext<ContextType, ValidatorType, ValidatableKey>;
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
    ValidatorType extends Validator<ContextType> = Validator<ContextType>,
    ValidatableKey extends PropertyKey[] = ['validatable']
>(
    validator : ValidatorType,
    properties ?: [],
    // valid ?: Middleware<ContextType>,
    invalid ?: Middleware<ContextType>,
    replace ?: boolean,
    validatable ?: [...ValidatableKey],
) : ValidatorReturnContext<ContextType, ValidatorType, ValidatableKey>;
// /**
//  * Same as no properties
//  *
//  * @param validator
//  * @param invalid
//  * @param replace
//  * @param properties
//  */
// export function ValidatorParameters<
//     ContextType extends Context = Context,
//     ValidatorType extends Validator<ContextType> = Validator<ContextType>,
// >(
//     validator : ValidatorType,
//     // valid ?: Middleware<ContextType>,
//     invalid ?: Middleware<ContextType>,
//     replace ?: boolean,
//     properties ?: []
// ) : Middleware<ContextType, ContextType & ValidatableContainer<InferValidatable<ValidatorType>>>;

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
    ContextType extends ValidatorTypeContext<Properties> = ValidatorTypeContext<Properties>,
    ValidatorType extends Validator<O.P.Pick<ContextType, Properties>> = Validator<O.P.Pick<ContextType, Properties>>,
    ValidatableKey extends PropertyKey[] = ['validatable']
>(
    validator : ValidatorType,
    properties ?: [...Properties],
    // valid ?: Middleware<ContextType>,
    invalid ?: Middleware<ContextType>,
    replace ?: boolean,
    validatable ?: [...ValidatableKey],
) : ValidatorReturnProperties<ContextType, Properties, ValidatorType, ValidatableKey>;

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
    ContextType extends ValidatorTypeContext<Properties>|Context,
    ValidatorType extends Validator<O.P.Pick<ContextType, Properties>>|Validator<ContextType>,
    ValidatableKey extends PropertyKey[]
>(
    validator : ValidatorType,
    properties : Properties|[] = [],
    // valid : Middleware<ContextType> = Next,
    invalid : Middleware<ContextType> = Stop,
    replace : boolean = true,
    validatable : ValidatableKey|['validatable'] = ['validatable'],
) : ValidatorReturnProperties<ContextType, Properties, ValidatorType, ValidatableKey> | ValidatorReturnContext<ContextType, ValidatorType, ValidatableKey> {

    const assignment : boolean = !!properties.length;

    return function (context: ValidatorTypeContext<Properties|[]>) {

        const value = assignment ? PickDeepParameters(context, ...properties) : context;

        const result = (validator as Validator)(value);

        context = assignment ? SetPathParameters(context as Context, result, ...validatable) as ValidatorTypeContext<Properties|[]> : context;

        if(result.valid) {

            if(replace) {

                SetPathParameters(context as any, result.value, ...properties);
            }

            return context;
        }

        return invalid(context as ContextType);

    } as ValidatorReturnProperties<ContextType, Properties, ValidatorType, ValidatableKey>;
}


namespace Validator {

    export const Parameters = ValidatorParameters;
    export const Parameter = ValidatorParameter;
    export type ArgumentProperties<
        Properties extends PropertyKey[],
        ContextType extends ValidatorTypeContext<Properties>,
        ValidatorType extends Validator<O.P.Pick<ContextType, Properties>>,
        ValidatableKey extends PropertyKey[]
    > = ValidatorArgumentProperties<Properties, ContextType, ValidatorType, ValidatableKey>;

    export type ArgumentContext<
        ContextType extends Context,
        ValidatorType extends Validator<ContextType>,
        ValidatableKey extends PropertyKey[]
    > = ValidatorArgumentContext<ContextType, ValidatorType, ValidatableKey>;

    export type ReturnProperties<
        Argument extends Context,
        Properties extends PropertyKey[],
        ValidatorType extends Validator<O.P.Pick<Argument, Properties>>,
        ValidatableKey extends PropertyKey[]
    > = ValidatorReturnProperties<Argument, Properties, ValidatorType, ValidatableKey>;

    export type ReturnContext<
        Argument extends Context,
        ValidatorType extends Validator<Argument>,
        ValidatableKey extends PropertyKey[]
    > = ValidatorReturnContext<Argument, ValidatorType, ValidatableKey>;

    export type TypeContext<Properties extends PropertyKey[]> = ValidatorTypeContext<Properties>;
}
export default  Validator;
