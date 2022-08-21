import Context from "../../context/context";
import {ListType} from "@alirya/uri/path/list";
import ContextPathSegments, {PathSegmentsGet} from "../../context/path-segments";
import {PathMatchers} from "../../middleware/path";
import { Match} from 'path-to-regexp';
import GetOrSet from "../../map/get-or-set";

export const PathMatchesKeyCache = Symbol('PathMatch');
/**
 *
 *
 * @param match
 * @param context
 * @param factory
 */
export default function ContextPath<Argument extends string, Storage extends string>(
    match : PathMatchers,
    context : Context,
    factory : (context: Context) => ListType = (ctx) => PathSegmentsGet(ContextPathSegments(ctx)) as ListType
) : Match|false  {

    const cached = GetOrSet(context.request as {}, PathMatchesKeyCache, () =>new Map<string, Match|false>());

    if(cached.has(match.path)) {

        return cached.get(match.path) as Match;

    } else {

        const path = factory(context).toString();

        const result = match.callback(path);

        cached.set(match.path, result);

        return result;
    }
}