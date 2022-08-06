import Validator from "@alirya/validator/simple";
import Validatable from '@alirya/validator/validatable/validatable';
import MinimumSizeMessage from "../assert/string/minimum-size";
import EmptyFileMessage from "../assert/string/empty-file";
import File from "../file";
import {MinimumSizeParameters} from "./minimum-size";
import { ValidatableParameters, ValidatableParameter } from '@alirya/validator/message/function/validatable';
import Message from "@alirya/message/message";

export function EmptyFileParameters() : Validator<File, File, Readonly<Validatable<object, string>>>;

export function EmptyFileParameters<Message>(
    message : ValidatableParameters<number, Message>
) : Validator<object, File, Readonly<Validatable<object, Message>>>;

export function EmptyFileParameters<Message>(
    message : ValidatableParameters<number, Message|string> = EmptyFileMessage.Parameters
) : Validator<object, File, Readonly<Validatable<null, Message|string>>> {

    return MinimumSizeParameters(0, message);
}
export type EmptyFileArgument<MessageT> = Message<ValidatableParameter<number, MessageT>>;

export function EmptyFileParameter() : Validator<object, File, Readonly<Validatable<object, string>>>;

export function EmptyFileParameter<Message>(
    {
        message
    } : EmptyFileArgument<Message>
) : Validator<object, File, Readonly<Validatable<object, Message>>>;

export function EmptyFileParameter<Message>(
    {
        message  = MinimumSizeMessage.Parameter
    } : Partial<EmptyFileArgument<Message|string>> = {}
) : Validator<object, File, Readonly<Validatable<null, Message|string>>> {

    return EmptyFileParameters((value, valid)=>message({value, valid}));
}


namespace FormidableFile {
    export const Parameters = EmptyFileParameters;
    export const Parameter = EmptyFileParameter;
}
export default FormidableFile;
