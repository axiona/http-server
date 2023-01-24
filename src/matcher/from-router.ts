import Matcher from "./matcher";
import ArrayFromRouter from "./array/from-router";
// import Root from "../router/root";
import FromPathMemoize from "./from-path-memoize";
import {FromPathArgumentsOption} from "./from-path";
import Metadata from "../router/metadata/metadata";


export default function FromRouter(
    router : Metadata,
    path: string,
    option: FromPathArgumentsOption = {}
) : Matcher {

    const matchers = ArrayFromRouter(/*Root*/(router));
    return FromPathMemoize(path, option, matchers);
}


