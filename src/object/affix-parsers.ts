import Escape from '../../../string/dist/pattern/escape';
import IsObject from '../../../object/dist/boolean/object';
import Digit from '../../../string/dist/boolean/digit';
import String from '../../../string/dist/boolean/string';
import SafeCast from '../../../string/dist/safe-cast';
import Callable from '../../../function/dist/callable';
import RemoveSuffixParameters from '../../../string/dist/remove-suffix-parameters';
import RemovePrefixParameters from '../../../string/dist/remove-prefix-parameters';
import AffixParser from './affix-parser';
import Deepmerge from 'deepmerge';

export default function AffixParsers(
 prefix : string = '[',
 suffix : string = ']',
) : Callable<[ReadonlyArray<[string, any]>]> {

    const parser = AffixParser(prefix, suffix);

    return function (argument : ReadonlyArray<[string, any]>) {

        let result = {};

        for (const [path, value] of argument) {

            result = Deepmerge(result, parser(path, value));
        }

        return result;
    };
}

