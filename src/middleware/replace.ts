import ApplicationContext from '../context/context.js';
import Middleware from './middleware.js';
import {O} from 'ts-toolbelt';
import { SetPathParameters } from '@alirya/object/set-path.js';
import {SelectPathParameters} from '@alirya/object/value/value/select-path.js';
import Union from "@alirya/promise/union.js";

export type ReplaceReturn<
    Properties extends PropertyKey[],
    BodyTo extends unknown,
    ContextType extends ApplicationContext /*& O.P.Record<Properties, unknown>*/ = ApplicationContext /*& O.P.Record<Properties, unknown>*/ ,
    > = Middleware<ContextType & O.P.Record<Properties, unknown>, O.P.Omit<ContextType, Properties> & O.P.Record<Properties, BodyTo>>;

export function ReplaceParameters<
    Properties extends PropertyKey[],
    BodyTo extends unknown,
    ContextType extends ApplicationContext/* & O.P.Record<Properties, unknown>*/
        = ApplicationContext/* & O.P.Record<Properties, unknown>*/,
>(
    filter : (data : O.Path<ContextType, Properties>, context: ContextType) => Union<BodyTo>,
    properties : [...Properties]
) : ReplaceReturn<Properties, BodyTo, ContextType> {

    return function (context) {

        const value = SelectPathParameters<Properties>(context as any, ...properties);

        return Promise.resolve(filter(value as any, context)).then(filtered=>{

            SetPathParameters(context as any, filtered, ...properties);

            return context;
        });

    } as ReplaceReturn<Properties, BodyTo, ContextType>;
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
) : ReplaceReturn<Properties, BodyTo, ContextType> {

    return ReplaceParameters<Properties, BodyTo, ContextType>(filter as (data : O.Path<ContextType, Properties>, context: ContextType) => BodyTo, properties);
}

namespace Replace {
    export const Parameters = ReplaceParameters;
    export const Parameter = ReplaceParameter;
}

export default Replace;
