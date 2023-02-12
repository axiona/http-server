import Matcher from './matcher.js';
import ArrayFromRouter from './array/from-router.js';
import FromPathMemoize from './from-path-memoize.js';
import {FromPathArgumentsOption} from './from-path.js';
import Metadata from '../router/metadata/metadata.js';


export default function FromRouter(
    router : Metadata,
    path: string,
    option: FromPathArgumentsOption = {}
) : Matcher {

    const matchers = ArrayFromRouter(/*Root*/(router));
    return FromPathMemoize(path, option, matchers);
}


