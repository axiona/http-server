import Context from '../../context/context.js';
import {ListType} from "@axiona/uri/path/list.js";
import {PathSegmentsGet} from '../../context/path-segments.js';
import { Match} from 'path-to-regexp';
import GetOrSet from '../../map/get-or-set.js';
import Matcher from '../matcher.js';

export const PathMatchesKeyCache = Symbol('PathMatch');
/**
 *
 *
 * @param match
 * @param context
 * @param factory
 */
export default function ContextPath<Argument extends string, Storage extends string>(
    match : Matcher,
    context : Context,
    factory : (context: Context) => ListType = (ctx) => PathSegmentsGet(ctx) as ListType
) : Match|false  {

    const cached = GetOrSet(context.request as {}, PathMatchesKeyCache, () =>new Map<string, Match|false>());

    if(cached.has(match.path)) {

        return cached.get(match.path) as Match;

    } else {

        const path = factory(context).toString();

        const result = match(path);

        cached.set(match.path, result);

        return result;
    }
}
