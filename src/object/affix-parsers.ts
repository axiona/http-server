import Callable from '@alirya/function/callable';
import {AffixParserArgument, AffixParserParameters} from './affix-parser';
import Deepmerge from 'deepmerge';
import File from "../file/boolean/file";
import Object_ from "../../../object/dist/boolean/object";

export function AffixParsersParametersArgumentsMergeableDefault(object) : boolean {
    return Object_(object) && !File(object);
}

export function AffixParsersParameters(
 prefix : string = '[',
 suffix : string = ']',
 mergeable : (value: object) => boolean = AffixParsersParametersArgumentsMergeableDefault
) : Callable<[ReadonlyArray<[string, any]>]> {

    const parser = AffixParserParameters(prefix, suffix);

    return function (argument : ReadonlyArray<[string, any]>) {

        let result = {};

        for (const [path, value] of argument) {

            result = Deepmerge(result, parser(path, value), {isMergeableObject:mergeable});
        }

        return result;
    };
}



export type AffixParsersArgument = AffixParserArgument & {
    mergeable ?: (value: object) => boolean
};

export function AffixParsersParameter({
    prefix,
    suffix,
    mergeable,
} : AffixParsersArgument) {

    return AffixParsersParameters(prefix, suffix, mergeable);
}


namespace AffixParsers {

    export const Parameters = AffixParsersParameters;
    export type Argument = AffixParsersArgument;
    export const Parameter = AffixParsersParameter;
}

export default AffixParsers;