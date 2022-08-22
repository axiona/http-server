import Context from './context';
import {ListParameter, ListType} from '@alirya/uri/path/list';
import {ExistsParameters} from '@alirya/object/property/boolean/exists';




export const PathSegmentsKey = Symbol('PathSegmentsKey');

export type PathPathSegmentsReturn<
    ContextType extends Context,
    StorageKey extends PropertyKey> = ContextType & {
    request : { [Key in StorageKey]:ListType }
};

/**
 * split request path into segments
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

        request[PathSegmentsKey] = ListParameter({
            segments : request.url,
            empty : false,
            prefix: true
        });
    }

    request[storage as string] = request[PathSegmentsKey];

    return context as PathPathSegmentsReturn<ContextType, StorageKey|string>;
}

export function PathSegmentsGet(context: Context) : ListType {

    if(context.request[PathSegmentsKey]) {

        return context.request[PathSegmentsKey];
    }

    return PathSegmentsGet(PathSegments(context));
}

