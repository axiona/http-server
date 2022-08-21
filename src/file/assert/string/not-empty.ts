import Validatable from '@alirya/validatable/validatable';
import Value from '@alirya/value/value';

export function NotEmptyParameters(
    value : number,
    valid : boolean
) : string {

    return valid
        ? `File is valid.`
        : `File is empty.`;
}


export type NotEmptyArgument = Value<number> & Validatable;

export function NotEmptyParameter({
    valid,
    value
} : NotEmptyArgument) : string {

    return NotEmptyParameters(
        value,
        valid
        );
}

namespace NotEmpty {
    export const Parameters = NotEmptyParameters;
    export type Argument = NotEmptyArgument;
    export const Parameter = NotEmptyParameter;
}
export default NotEmpty;
