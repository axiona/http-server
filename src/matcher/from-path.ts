import MatcherType from "./matcher";
import { match, ParseOptions, TokensToRegexpOptions, RegexpToFunctionOptions} from 'path-to-regexp';

export type FromPathArgumentsOption = ParseOptions & TokensToRegexpOptions & RegexpToFunctionOptions;

export default function FromPath(path: string, option: FromPathArgumentsOption = {}) : MatcherType {

    return Object.freeze(Object.assign(match(path, option), {option, path}));
}