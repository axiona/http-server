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


export type MimeTypes =
    Validatable &
    Value<string> &
    Readonly<ReadonlyList<string>>;

export function MimeTypesParameter({valid, value, array} : MimeTypes) : string {

    return MimeTypesParameters(value, valid, array);
}

namespace MimeTypes {
    export const Parameters = MimeTypesParameters;
    export type Argument = MimeTypes;
    export const Parameter = MimeTypesParameter;
}
export default MimeTypes;
