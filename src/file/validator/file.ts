import {ObjectParameters} from "@alirya/object/validator/object";
import {AndParameters} from "@alirya/array/validatable/and";
import Validator from "@alirya/validator/simple";
import {ValuePartialParameters} from "@alirya/array/validator/value-partial";
import {CallbackParameters} from "@alirya/validator/callback";
import FormidableFileValidation from "../boolean/file";
import {StaticParameters, StaticParameter} from '@alirya/validator/message/function/static';
import Validatable from '@alirya/validator/validatable/validatable';
import FormidableFileMessage from "../assert/string/file";
import InvalidFirstValidLast from "@alirya/array/message/message/list/invalid-first-valid-last";
import File from "../file";
import Chain from '../../../../validator/dist/chain';

export function FileParameters() : Validator<object, File, string>;

export function FileParameters<Message>(
    message : StaticParameters<object, File, true, false, Message>
) : Validator<object, File, Message>;

export function FileParameters<Message>(
    message : StaticParameters<object, File, true, false, Message|string> = FormidableFileMessage.Parameters
) : Validator<object, File, Message|string> {

    return Chain(ObjectParameters(), CallbackParameters(FormidableFileValidation, message)) as Validator<object, File, Message|string>;
    //
    // return ValuePartialParameters([
    //     ObjectParameters(),
    //     CallbackParameters(FormidableFileValidation, message)
    // ], AndParameters, InvalidFirstValidLast, false);
}

export function FileParameter(
) : Validator<object, File, string>;

export function FileParameter<Message>(
    message : StaticParameter<object, File, true, false, Message>
) : Validator<object, File, Message>;

export function FileParameter<Message>(
    message : StaticParameter<object, File, true, false, Message|string> = FormidableFileMessage.Parameter
) : Validator<object, File, Message|string> {

    return FileParameters((value, valid)=>message({value, valid}));
}


namespace File {
    export const Parameters = FileParameters;
    export const Parameter = FileParameter;
}
export default File;
