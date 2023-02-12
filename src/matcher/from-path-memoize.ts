import MatcherType from './matcher.js';
import FromPath, {FromPathArgumentsOption} from './from-path.js';
import {diff} from "deep-object-diff";
import Empty from '@alirya/object/boolean/empty.js';

export default function FromPathMemoize(
    path: string,
    option: FromPathArgumentsOption = {},
    container : MatcherType[]
) : MatcherType {

    for(const matcher of container) {

        if(matcher.path === path) {

            const opt = diff(matcher.option, option);

            if(Empty(opt)) {

                return matcher;

            }
        }
    }

    return FromPath(path, option);
}