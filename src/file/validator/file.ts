import {ObjectParameters} from "@axiona/object/validator/object.js";
import Validator from "@axiona/validator/simple.js";
import {CallbackParameters} from "@axiona/validator/callback.js";
import FormidableFileValidation from '../boolean/file.js';
import {StaticParameters, StaticParameter} from '@axiona/validator/message/function/static.js';
import FormidableFileMessage from '../assert/string/file.js';
import File from '../file.js';
import Chain from '@axiona/validator/chain.js';

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
