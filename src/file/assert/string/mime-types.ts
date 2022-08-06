import Validatable from '@alirya/validatable/validatable';
import Value from '@alirya/value/value';
import ReadonlyList from "../../../../../array/dist/array/readonly";

export function MimeTypesParameters(
    value : string,
    valid : boolean,
    arrays : ReadonlyArray<string>,
) : string {

    return valid
        ? `Mime type ${value} is valid.`
        : `Mime type ${value} is not valid, allowed ${arrays.join(', ')}.`;
}


export type ArrayArgument =
    Validatable &
    Value<string> &
    Readonly<ReadonlyList<string>>;

export function MimeTypesParameter({valid, value, array} : ArrayArgument) : string {

    return MimeTypesParameters(value, valid, array);
}

namespace Array {
    export const Parameters = MimeTypesParameters;
    export type Argument = ArrayArgument;
    export const Parameter = MimeTypesParameter;
}
export default Array;
