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


export type ArrayArgument = Value<number> & Validatable;

export function NotEmptyParameter({
    valid,
    value
} : ArrayArgument) : string {

    return NotEmptyParameters(
        value,
        valid
        );
}

namespace Array {
    export const Parameters = NotEmptyParameters;
    export type Argument = ArrayArgument;
    export const Parameter = NotEmptyParameter;
}
export default Array;
