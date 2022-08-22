import Escape from '@alirya/string/pattern/escape';
import Digit from '@alirya/string/boolean/digit';
import String from '@alirya/string/boolean/string';
import SafeCast from '@alirya/string/safe-cast';
import Callable from '@alirya/function/callable';
import {RemoveSuffixParameters} from '@alirya/string/remove-suffix';
import {RemovePrefixParameters} from '@alirya/string/remove-prefix';


export default function AffixParser(
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

        return BracesParserSet(paths ?? [], value);
    };
}



export function BracesParserSet(keys : ReadonlyArray<string>, value : any) : Record<PropertyKey, any> {

    let clone = keys.slice(0);
    const key = clone.shift();



    if(clone.length) {


        value = BracesParserSet(clone, value);
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
