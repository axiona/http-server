import {ObjectParameters} from "@alirya/object/validator/object.js";
import {AndParameters} from "@alirya/array/validatable/and.js";
import Validator from "@alirya/validator/simple.js";
import {ValuePartialParameters} from "@alirya/array/validator/value-partial.js";
import Validatable from '@alirya/validator/validatable/validatable.js';
import MimeTypeMessage from '../assert/string/mime-types.js';
import InvalidFirstValidLast from "@alirya/array/message/message/list/invalid-first-valid-last.js";
import File from '../file.js';
import {InParameters, InArgumentsMessage, InArgument} from "@alirya/array/validator/in.js";
import {MapAllParameters} from '@alirya/object/validator/map-all.js';
import AndRecord from '@alirya/object/validatable/and.js';
import InvalidMessageRecord from '@alirya/object/message/message/record/invalid.js';
import ValidMessageRecord from '@alirya/object/message/message/record/valid.js';
import ValidatorInterface from "@alirya/validator/simple.js";
import {FileParameters} from './file.js';
import Chain from '@alirya/validator/chain.js';

export function MimeTypesParameters(mimes: ReadonlyArray<string>) : Validator<File, File, string>;

export function MimeTypesParameters<Message>(
    mimes: ReadonlyArray<string>,
    message : InArgumentsMessage<string, Message>
) : Validator<object, File, Message>;

export function MimeTypesParameters<Message>(
    mimes: ReadonlyArray<string>,
    message : InArgumentsMessage<string, Message|string> = MimeTypeMessage.Parameters
) : Validator<object, File, Message|string> {

    mimes = mimes.map(mime=>mime.toLowerCase());

    const record : Record<'mimetype', ValidatorInterface> = {
        mimetype : InParameters(mimes, undefined, message)
    };

    const validator = MapAllParameters(record, AndRecord, (record)=>InvalidMessageRecord(record).mimetype || ValidMessageRecord(record).mimetype);

    return Chain(FileParameters(), validator) as Validator<object, File, Message|string>;

    // return ValuePartialParameters([
    //     ObjectParameters(),
    //     validator
    // ], AndParameters, InvalidFirstValidLast, false) as Validator<object, File, Message|string>;
}




export function MimeTypesParameter(
    {
        array
    } : InArgument<string, string>
) : Validator<object, File, string>;

export function MimeTypesParameter<Message>(
    {
        array,
        message
    } : InArgument<string, Message>
) : Validator<object, File, Message>;

export function MimeTypesParameter<Message>(
    {
        array,
        message  = MimeTypeMessage.Parameter
    } : InArgument<string, Message|string>
) : Validator<object, File, Message|string> {

    return MimeTypesParameters(array, (value, valid, array)=>message({array, value, valid}));
}


namespace MimeTypes {
    export const Parameters = MimeTypesParameters;
    export const Parameter = MimeTypesParameter;
}
export default MimeTypes;
