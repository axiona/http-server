import MatcherType from "./matcher";
import { match, ParseOptions, TokensToRegexpOptions, RegexpToFunctionOptions, MatchFunction, Match} from 'path-to-regexp';

export type FromPathArgumentsOption = ParseOptions & TokensToRegexpOptions & RegexpToFunctionOptions;

export default function FromPath(path: string, option: FromPathArgumentsOption = {}) : MatcherType {

    const cache : Map<string, Match> = new Map<string, Match>();
    const matcher = match(path, option);

    const callback : MatchFunction<object> = function (path: string) {

        if(cache.has(path)) {

            return cache.get(path) as Match;
        }

        let result = matcher(path);

        if(result) {

            result = Object.freeze(result);
        }

        cache.set(path, result);

        return result;
    };

    return Object.freeze(Object.assign(callback, {option, path}));
    // return Object.freeze(Object.assign(match(path, option), {option, path}));
}