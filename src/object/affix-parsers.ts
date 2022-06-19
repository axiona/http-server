import Callable from '../../../function/dist/callable';
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

