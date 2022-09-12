import Escape from '@alirya/string/pattern/escape';
import Digit from '@alirya/string/boolean/digit';
import String from '@alirya/string/boolean/string';
import SafeCast from '@alirya/string/safe-cast';
import Callable from '@alirya/function/callable';
import {RemoveSuffixParameters} from '@alirya/string/remove-suffix';
import {RemovePrefixParameters} from '@alirya/string/remove-prefix';
import Prefix from '@alirya/string/prefix/prefix';
import Suffix from '@alirya/string/suffix/suffix';


export function AffixParserParameters(
 prefix : string = '[',
 suffix : string = ']',
) : Callable<[string, any], Record<string, any>> {

    prefix = Escape(prefix[0]);
    suffix = Escape(suffix[0]);

    const pattern = new RegExp(`${prefix}?[^${prefix}${suffix}]*${suffix}?`, 'g');

    return function (path : string, value) {

        let paths = path.match(pattern) ?? [];

        paths = paths
            .filter(path=>path.length)
            .map(path=>RemovePrefixParameters(path, '['))
            .map(path=>RemoveSuffixParameters(path, ']'));

        return AffixParserParameterBracesSet(paths ?? [], value);
    };
}

export type AffixParserArgument = Partial<Prefix & Suffix>;

export function AffixParserParameter(
    {
        prefix,
        suffix,
    } : AffixParserArgument
) : Callable<[string, any], Record<string, any>> {

    return AffixParserParameters(prefix, suffix);
}


export function AffixParserParameterBracesSet(keys : ReadonlyArray<string>, value : any) : Record<PropertyKey, any> {

    let clone = keys.slice(0);
    const key = clone.shift();



    if(clone.length) {


        value = AffixParserParameterBracesSet(clone, value);
    }

    if(key === undefined) {

        return value;

    } else if(key === '') {

        return [value];

    } else if(Digit(key)) {

        const data : any[] = [];
        data[parseInt(key)] = value;
        return data;

    } else if(String(key)) {

        return {[key]:value};

    } else {
        const type = SafeCast(key);
        throw new Error(`unable to determine key container : "${type}"`);
    }

}


namespace AffixParser {

    export const Parameters = AffixParserParameters;
    export type Argument = AffixParserArgument;
    export const Parameter = AffixParserParameter;
}

export default AffixParser;