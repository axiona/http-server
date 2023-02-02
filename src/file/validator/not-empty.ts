import Validator from "@alirya/validator/simple";
import Validatable from '@alirya/validator/validatable/validatable';
import MinimumSizeMessage from "../assert/string/minimum-size";
import EmptyFileMessage from "../assert/string/not-empty";
import File from "../file";
import {MinimumSizeParameters} from "./minimum-size";
import { ValidatableParameters, ValidatableParameter } from '@alirya/validator/message/function/validatable';
import Message from "@alirya/message/message";

export function NotEmptyParameters() : Validator<File, File, string>;

export function NotEmptyParameters<Message>(
    message : ValidatableParameters<number, Message>
) : Validator<object, File, Message>;

export function NotEmptyParameters<Message>(
    message : ValidatableParameters<number, Message|string> = EmptyFileMessage.Parameters
) : Validator<object, File, Message|string> {

    return MinimumSizeParameters(0, message);
}
export type EmptyFileArgument<MessageT> = Message<ValidatableParameter<number, MessageT>>;

export function NotEmptyParameter() : Validator<object, File, string>;

export function NotEmptyParameter<Message>(
    {
        message
    } : EmptyFileArgument<Message>
) : Validator<object, File, Readonly<Validatable<object, Message>>>;

export function NotEmptyParameter<Message>(
    {
        message  = MinimumSizeMessage.Parameter
    } : Partial<EmptyFileArgument<Message|string>> = {}
) : Validator<object, File, Message|string> {

    return NotEmptyParameters((value, valid)=>message({value, valid}));
}


namespace NotEmpty {
    export const Parameters = NotEmptyParameters;
    export const Parameter = NotEmptyParameter;
}
export default NotEmpty;
