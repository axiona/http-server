import { Match, ParseOptions, TokensToRegexpOptions, RegexpToFunctionOptions} from 'path-to-regexp';

export type MatcherOption = ParseOptions & TokensToRegexpOptions & RegexpToFunctionOptions;

export interface Matcher<P extends object = object> {
    (path: string) : Match<P>;
    readonly path : string;
    readonly option : MatcherOption;
}

export default Matcher;
