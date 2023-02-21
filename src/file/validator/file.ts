import {ObjectParameters} from "@alirya/object/validator/object.js";
import {AndParameters} from "@alirya/array/validatable/and.js";
import Validator from "@alirya/validator/simple.js";
import {ValuePartialParameters} from "@alirya/array/validator/value-partial.js";
import {CallbackParameters} from "@alirya/validator/callback.js";
import FormidableFileValidation from '../boolean/file.js';
import {StaticParameters, StaticParameter} from '@alirya/validator/message/function/static.js';
import Validatable from '@alirya/validator/validatable/validatable.js';
import FormidableFileMessage from '../assert/string/file.js';
import InvalidFirstValidLast from "@alirya/array/message/message/list/invalid-first-valid-last.js";
import File from '../file.js';
import Chain from '@alirya/validator/chain.js';

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
