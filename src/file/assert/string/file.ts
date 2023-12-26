import Value from '@axiona/value/value.js';
import Validatable from '@axiona/validatable/validatable.js';
import {TemplateParameters} from "@axiona/string/function/template.js";

const template = TemplateParameters<Record<'subject'|'valid', string>>('{subject} {valid} compatible with formidable-file.');

/**
 * string intended for FormidableFile message
 *
 * @param valid
 * @param value
 * @param subject
 */
export function FileParameters(
    value : unknown,
    valid : boolean,
    subject  = 'value'
) : string {

    return template({
        subject,
        valid : valid ? 'is' : 'is not'
    });
}


export type FileArgument = Value & Validatable & {
    subject ?: string,
};

/**
 * string intended for FormidableFile message
 *
 * @param valid
 * @param value
 * @param subject
 * @param conversion
 */
export function FileParameter(
    {
        value,
        valid,
        subject,
    } : FileArgument
) : string {

    return FileParameters(value, valid, subject);
}



namespace File {
    export const Parameters = FileParameters;
    export const Parameter = FileParameter;
    export type Argument = FileArgument;
}
export default File;
