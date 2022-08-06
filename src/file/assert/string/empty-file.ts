import Validatable from '@alirya/validatable/validatable';
import Value from '@alirya/value/value';

export function InParameters(
    value : number,
    valid : boolean
) : string {

    return valid
        ? `File is valid.`
        : `File is empty.`;
}


export type ArrayArgument = Value<number> & Validatable;

export function InParameter({
    valid,
    value
} : ArrayArgument) : string {

    return InParameters(
        value,
        valid
        );
}

namespace Array {
    export const Parameters = InParameters;
    export type Argument = ArrayArgument;
    export const Parameter = InParameter;
}
export default Array;
