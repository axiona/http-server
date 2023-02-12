import ApplicationContext from '../context/context.js';
import Middleware from './middleware.js';
import {O} from 'ts-toolbelt';
import { SetPathParameters } from '@alirya/object/set-path.js';
import Union from "@alirya/promise/union.js";

export type SetReturn<
    Properties extends PropertyKey[],
    BodyTo extends unknown,
    ContextType extends ApplicationContext & O.P.Record<Properties, unknown>
        = ApplicationContext & O.P.Record<Properties, unknown> ,
    > = Middleware<ContextType, O.P.Omit<ContextType, Properties> & O.P.Record<Properties, BodyTo>>;

export function SetParameters<
    Properties extends PropertyKey[],
    BodyTo extends unknown,
    ContextType extends ApplicationContext & O.P.Record<Properties, unknown>
        = ApplicationContext & O.P.Record<Properties, unknown> ,
>(
    callback : (context: ContextType) => Union<BodyTo>,
    properties : [...Properties]
) : SetReturn<Properties, BodyTo, ContextType> {

    return function (context) {

        return Promise.resolve(callback(context)).then(filtered=>{

            SetPathParameters(context as any, filtered, ...properties);

            return context;
        });

    } as SetReturn<Properties, BodyTo, ContextType>;
}

export function SetParameter<
    Properties extends PropertyKey[],
    BodyTo extends unknown,
    ContextType extends ApplicationContext & O.P.Record<Properties, unknown> = ApplicationContext & O.P.Record<Properties, unknown>,
>( {
       callback,
       properties
   } : {
       callback : (context: ContextType) => Union<BodyTo>,
       properties : [...Properties],
   }
) : SetReturn<Properties, BodyTo, ContextType> {

    return SetParameters<Properties, BodyTo, ContextType>(callback as (context: ContextType) => BodyTo, properties);
}

namespace Set {
    export const Parameters = SetParameters;
    export const Parameter = SetParameter;
}

export default Set;
