import Context from './context';
import List, {ListParameterType} from '@alirya/uri/path/list-parameter';
import ExistsParameters from '@alirya/object/property/boolean/exists-parameters';

export const PathSegmentsKey = Symbol('PathSegmentsKey');

export type PathPathSegmentsReturn<
    ContextType extends Context,
    StorageKey extends PropertyKey> = ContextType & {
    request : { [Key in StorageKey]:ListParameterType }
};

/**
 * split request path into segments
 *
 *
 *
 * @param context
 * @param storage
 * @constructor
 */
export default function PathSegments<
    ContextType extends Context,
    StorageKey extends string,
>(
    context : ContextType,
    storage : StorageKey
) : PathPathSegmentsReturn<ContextType, StorageKey>;

export default function PathSegments<
    ContextType extends Context,
>(
    context : ContextType,
) : PathPathSegmentsReturn<ContextType, 'paths'>;

export default function PathSegments<
    ContextType extends Context,
    StorageKey extends string,
>(
    context : ContextType,
    storage : StorageKey|string = 'paths'
) : PathPathSegmentsReturn<ContextType, StorageKey|string> {

    const request = context.request;

    if(!ExistsParameters(request, PathSegmentsKey)) {

        request[PathSegmentsKey] = List({
            segments : request.url,
            empty : false,
            prefix: true
        });
    }

    request[storage as string] = request[PathSegmentsKey];

    return context as PathPathSegmentsReturn<ContextType, StorageKey|string>;
}

export function PathSegmentsGet(context: Context) : ListParameterType|undefined {

    return context.request[PathSegmentsKey];
}

