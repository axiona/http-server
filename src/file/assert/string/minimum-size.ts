import Validatable from '@alirya/validatable/validatable.js';
import Value from '@alirya/value/value.js';
import Inclusive from '@alirya/number/inclusive/inclusive.js';
import Minimum from '@alirya/number/minimum/minimum.js';

export function MinimumSizeParameters(
    value : number,
    valid : boolean,
    minimum : number,
    inclusive : boolean
) : string {

    return valid
        ? `File size is valid.`
        : `File size too small.`;
}


export type MinimumSizeArgument =
    Value<number> & Validatable & Minimum & Inclusive & {subject ?: string};

export function MinimumSizeParameter({
    valid,
    value,
    minimum,
    inclusive,
} : MinimumSizeArgument) : string {

    return MinimumSizeParameters(
        value,
        valid,
        minimum,
        inclusive
        );
}

namespace MinimumSize {
    export const Parameters = MinimumSizeParameters;
    export type Argument = MinimumSizeArgument;
    export const Parameter = MinimumSizeParameter;
}
export default MinimumSize;
