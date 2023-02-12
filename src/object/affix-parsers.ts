import Callable from '@alirya/function/callable.js';
import {AffixParserArgument, AffixParserParameters} from './affix-parser.js';
import Deepmerge from 'deepmerge';
import File from '../file/boolean/file.js';
import Object_ from '@alirya/object/boolean/object.js';

export function AffixParsersParametersArgumentsMergeableDefault(object) : boolean {
    return Object_(object) && !File(object);
}

export function AffixParsersParameters(
 prefix  = '[',
 suffix  = ']',
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