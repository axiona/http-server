import {ObjectParameters} from "@alirya/object/validator/object";
import {AndParameters} from "@alirya/array/validatable/and";
import Validator from "@alirya/validator/simple";
import {ValuePartialParameters} from "@alirya/array/validator/value-partial";
import Validatable from '@alirya/validator/validatable/validatable';
import MimeTypeMessage from "../assert/string/mime-types";
import InvalidFirstValidLast from "@alirya/array/message/message/list/invalid-first-valid-last";
import File from "../file";
import {InParameters, InArgumentsMessage, InArgument} from "@alirya/array/validator/in";
import {MapAllParameters} from '@alirya/object/validator/map-all';
import AndRecord from '@alirya/object/validatable/and';
import InvalidMessageRecord from '@alirya/object/message/message/record/invalid';
import ValidMessageRecord from '@alirya/object/message/message/record/valid';
import ValidatorInterface from "@alirya/validator/simple";
import {FileParameters} from './file';
import Chain from '../../../../validator/dist/chain';

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
