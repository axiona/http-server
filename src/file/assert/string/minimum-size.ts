import Validatable from '@alirya/validatable/validatable';
import Value from '@alirya/value/value';
import Inclusive from "../../../../../number/dist/inclusive/inclusive";
import Minimum from "../../../../../number/dist/minimum/minimum";

export function InParameters(
    value : number,
    valid : boolean,
    minimum : number,
    inclusive : boolean
) : string {

    return valid
        ? `File size is valid.`
        : `File size too small.`;
}


export type ArrayArgument =
    Value<number> & Validatable & Minimum & Inclusive & {subject ?: string};

export function InParameter({
    valid,
    value,
    minimum,
    inclusive,
} : ArrayArgument) : string {

    return InParameters(
        value,
        valid,
        minimum,
        inclusive
        );
}

namespace Array {
    export const Parameters = InParameters;
    export type Argument = ArrayArgument;
    export const Parameter = InParameter;
}
export default Array;
