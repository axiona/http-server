import Router from "../router/router";
import Matcher from "./matcher";
import ArrayFromRouter from "./array/from-router";
import Root from "../router/root";
import FromPathMemoize from "./from-path-memoize";
import {FromPathArgumentsOption} from "./from-path";


export default function FromRouter(
    router : Router,
    path: string,
    option: FromPathArgumentsOption = {}
) : Matcher {

    const matchers = ArrayFromRouter(Root(router));
    return FromPathMemoize(path, option, matchers);
}


