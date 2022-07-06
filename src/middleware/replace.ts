import ApplicationContext from '../context/context.js';
import Middleware from './middleware.js';
import {O} from 'ts-toolbelt';
import SetPathParameters from '@alirya/object/set-path-parameters.js';
import {SelectPathParameters} from '@alirya/object/value/value/select-path.js';
import ReplacePath from '@alirya/object/replace-path.js';

export function ReplaceParameters<
    Properties extends PropertyKey[],
    BodyTo extends unknown,
    ContextType extends ApplicationContext & O.P.Record<Properties, unknown>
        = ApplicationContext & O.P.Record<Properties, unknown> ,
>(
    filter : (data : O.Path<ContextType, Properties>, context: ContextType) => BodyTo,
    properties : [...Properties]
) : Middleware<ContextType, ReplacePath<ContextType, BodyTo, Properties>> {

    return function (context) {

        const value = SelectPathParameters<Properties>(context as any, ...properties);

        const filtered = filter(value as any, context);

        SetPathParameters(context as any, filtered, ...properties);

        return context;

    } as Middleware<ContextType, ReplacePath<ContextType, BodyTo, Properties>>;
}

export function ReplaceParameter<
    Properties extends PropertyKey[],
    BodyTo extends unknown,
    ContextType extends ApplicationContext & O.P.Record<Properties, unknown> = ApplicationContext & O.P.Record<Properties, unknown>,
>( {
       filter,
       properties
   } : {
       filter : (data : O.Path<ContextType, Properties>, context: ContextType) => BodyTo,
       properties : [...Properties],
   }
) : Middleware<ContextType, ReplacePath<ContextType, BodyTo, Properties>> {

    return ReplaceParameters<Properties, BodyTo, ContextType>(filter as (data : O.Path<ContextType, Properties>, context: ContextType) => BodyTo, properties);
}

namespace Replace {
    export const Parameters = ReplaceParameters;
    export const Parameter = ReplaceParameter;
}

export default Replace;
