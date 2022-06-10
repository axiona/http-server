import Escape from '../../../string/dist/pattern/escape';
import IsObject from '../../../object/dist/boolean/object';
import Digit from '../../../string/dist/boolean/digit';
import String from '../../../string/dist/boolean/string';
import SafeCast from '../../../string/dist/safe-cast';
import Callable from '../../../function/dist/callable';
import RemoveSuffixParameters from '../../../string/dist/remove-suffix-parameters';
import RemovePrefixParameters from '../../../string/dist/remove-prefix-parameters';


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



export function BracesParserSet(/*container : Record<PropertyKey, any>,*/ keys : ReadonlyArray<string>, value : any/*, pattern : RegExp*/) : Record<PropertyKey, any> {

    let clone = keys.slice(0);
    const key = clone.shift();



    if(clone.length) {


        value = BracesParserSet(clone, value/*, pattern*/);
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

    //
    // if(key === undefined) {
    //
    //     return value;
    //
    // } else if(key === '' || Digit(key)) {
    //
    //
    // }
    //
    //
    // for (const [index, key] of keys.entries()) {
    //
    //     let next = keys[index + 1];
    //
    //     // initialize
    //     if(container[key] === undefined) {
    //
    //         if(next === '') {
    //
    //             container[key] = [];
    //
    //         } else if(next) {
    //
    //             container[key] = {};
    //
    //         } else { // next is undefined
    //
    //             // if(Array.isArray(container[key])) {
    //             //
    //             //     container[key].push(value);
    //             //
    //             // } else {
    //             //
    //             //     container[key] = value;
    //             // }
    //         }
    //
    //         // container = container[key];
    //     }
    //
    //
    //     if(next === '') {
    //
    //         if(Array.isArray(container[key])) {
    //
    //             container[key].push(value);
    //
    //         } else {
    //
    //             container[key] = [value];
    //         }
    //
    //     } else if(next) {
    //
    //         if(Array.isArray(container[key])) {
    //
    //             container[key] = {};
    //
    //         } else if (!IsObject(container[key])) {
    //
    //             container[key] = {};
    //         }
    //
    //     } else {
    //
    //     }
    //
    // }



}