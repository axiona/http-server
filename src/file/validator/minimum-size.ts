import {ObjectParameters} from "@alirya/object/validator/object.js";
import {AndParameters} from "@alirya/array/validatable/and.js";
import Validator from "@alirya/validator/simple.js";
import {ValuePartialParameters} from "@alirya/array/validator/value-partial.js";
import Validatable from '@alirya/validator/validatable/validatable.js';
import MinimumSizeMessage from '../assert/string/minimum-size.js';
import InvalidFirstValidLast from "@alirya/array/message/message/list/invalid-first-valid-last.js";
import File from '../file.js';
import {MapAllParameters} from '@alirya/object/validator/map-all.js';
import AndRecord from '@alirya/object/validatable/and.js';
import MapMessage from '@alirya/object/message/message/record/map.js';
import ValidatorInterface from "@alirya/validator/simple.js";
import {GreaterParameters, GreaterArgumentsMessage, GreaterArgument} from '@alirya/number/validator/greater.js';
import Chain from '../../../../validator/dist/chain.js';
import {FileParameters} from './file.js';

export function MinimumSizeParameters() : Validator<File, File, string>;
export function MinimumSizeParameters(minimum: number) : Validator<File, File, string>;

export function MinimumSizeParameters<Message>(
    minimum: number,
    message : GreaterArgumentsMessage<Message>
) : Validator<object, File, Message>;

export function MinimumSizeParameters<Message>(
    minimum = 256,
    message : GreaterArgumentsMessage<Message|string> = MinimumSizeMessage.Parameters
) : Validator<object, File, Message|string> {

    const record : Record<'size', ValidatorInterface> = {
        size : GreaterParameters(minimum, true, message) as ValidatorInterface<number, number>
    };

    const validator = MapAllParameters(record, AndRecord, (record)=>MapMessage(record).size);

    return Chain(FileParameters(), validator) as Validator<object, File, Message|string>;
    //
    // return function (d)  {
    //     let result = ValuePartialParameters([
    //         ObjectParameters(),
    //         validator
    //     ], AndParameters, InvalidFirstValidLast, false)(d);
    //
    //     return result;
    // } as Validator<object, File, Message|string>;
}




export function MinimumSizeParameter() : Validator<object, File, string>;


export function MinimumSizeParameter(
    {
        minimum
    } : GreaterArgument<string>
) : Validator<object, File, string>;

export function MinimumSizeParameter<Message>(
    {
        minimum,
        message
    } : GreaterArgument<Message>
) : Validator<object, File, Message>;

export function MinimumSizeParameter<Message>(
    {
        minimum = 256,
        message  = MinimumSizeMessage.Parameter
    } : Partial<GreaterArgument<Message|string>> = {}
) : Validator<object, File, Message|string> {

    return MinimumSizeParameters(minimum, (value, valid, minimum, inclusive)=>message({minimum, inclusive, value, valid}));
}


namespace MinimumSize {
    export const Parameters = MinimumSizeParameters;
    export const Parameter = MinimumSizeParameter;
}
export default MinimumSize;
