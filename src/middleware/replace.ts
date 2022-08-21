import ApplicationContext from '../context/context';
import Middleware from './middleware';
import {O} from 'ts-toolbelt';
import { SetPathParameters } from '@alirya/object/set-path';
import {SelectPathParameters} from '@alirya/object/value/value/select-path';
import Union from "@alirya/promise/union";
//import ReplacePath from '@alirya/object/replace-path';

//type ReplacePath<Target extends object, Replace extends any, Properties extends ReadonlyArray<PropertyKey>> = O.P.Omit<Target, Properties> & O.P.Record<Properties, Replace>;

export type ReplaceReturn<
    Properties extends PropertyKey[],
    BodyTo extends unknown,
    ContextType extends ApplicationContext & O.P.Record<Properties, unknown>
        = ApplicationContext & O.P.Record<Properties, unknown> ,
    > = Middleware<ContextType, O.P.Omit<ContextType, Properties> & O.P.Record<Properties, BodyTo>>;

export function ReplaceParameters<
    Properties extends PropertyKey[],
    BodyTo extends unknown,
    ContextType extends ApplicationContext & O.P.Record<Properties, unknown>
        = ApplicationContext & O.P.Record<Properties, unknown> ,
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
