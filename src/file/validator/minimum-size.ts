import {ObjectParameters} from "@alirya/object/validator/object";
import {AndParameters} from "@alirya/array/validatable/and";
import Validator from "@alirya/validator/simple";
import {ValuePartialParameters} from "@alirya/array/validator/value-partial";
import Validatable from '@alirya/validator/validatable/validatable';
import MinimumSizeMessage from "../assert/string/minimum-size";
import InvalidFirstValidLast from "@alirya/array/message/message/list/invalid-first-valid-last";
import File from "../file";
import {MapAllParameters} from '@alirya/object/validator/map-all';
import AndRecord from '@alirya/object/validatable/and';
import MapMessage from '@alirya/object/message/message/record/map';
import ValidatorInterface from "@alirya/validator/simple";
import {GreaterParameters, GreaterArgumentsMessage, GreaterArgument} from "../../../../number/dist/validator/greater";

export function MinimumSizeParameters() : Validator<File, File, Readonly<Validatable<object, string>>>;
export function MinimumSizeParameters(minimum: number) : Validator<File, File, Readonly<Validatable<object, string>>>;

export function MinimumSizeParameters<Message>(
    minimum: number,
    message : GreaterArgumentsMessage<Message>
) : Validator<object, File, Readonly<Validatable<object, Message>>>;

export function MinimumSizeParameters<Message>(
    minimum: number = 256,
    message : GreaterArgumentsMessage<Message|string> = MinimumSizeMessage.Parameters
) : Validator<object, File, Readonly<Validatable<null, Message|string>>> {

    const record : Record<'size', ValidatorInterface> = {
        size : GreaterParameters(minimum, true, message) as ValidatorInterface<number, number>
    };

    const validator = MapAllParameters(record, AndRecord, (record)=>MapMessage(record).size);

    return ValuePartialParameters([
        ObjectParameters(),
        validator
    ], AndParameters, InvalidFirstValidLast, false) as Validator<object, File, Readonly<Validatable<null, Message|string>>>;
}




export function MinimumSizeParameter() : Validator<object, File, Readonly<Validatable<object, string>>>;


export function MinimumSizeParameter(
    {
        minimum
    } : GreaterArgument<string>
) : Validator<object, File, Readonly<Validatable<object, string>>>;

export function MinimumSizeParameter<Message>(
    {
        minimum,
        message
    } : GreaterArgument<Message>
) : Validator<object, File, Readonly<Validatable<object, Message>>>;

export function MinimumSizeParameter<Message>(
    {
        minimum = 256,
        message  = MinimumSizeMessage.Parameter
    } : Partial<GreaterArgument<Message|string>> = {}
) : Validator<object, File, Readonly<Validatable<null, Message|string>>> {

    return MinimumSizeParameters(minimum, (value, valid, minimum, inclusive)=>message({minimum, inclusive, value, valid}));
}


namespace MinimumSize {
    export const Parameters = MinimumSizeParameters;
    export const Parameter = MinimumSizeParameter;
}
export default MinimumSize;
