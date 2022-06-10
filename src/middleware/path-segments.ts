import Context from '../context/context';
import Middleware from './middleware';
import ContextPathSegments, {PathPathSegmentsReturn as ContextPathPathSegmentsReturn} from '../context/path-segments';

export type PathSegmentsReturn<
    ContextType extends Context,
    StorageKey extends string,
> =  Middleware<
    ContextType,
    ContextPathPathSegmentsReturn<ContextType, StorageKey>
>;

export default function PathSegments<
    ContextType extends Context,
    StorageKey extends string,
>(
    storage : StorageKey
) : PathSegmentsReturn<ContextType, StorageKey>;

export default function PathSegments<
    ContextType extends Context,
>(
) : PathSegmentsReturn<ContextType, 'paths'>;

export default function PathSegments<
    ContextType extends Context,
    StorageKey extends string,
>(
    storage : StorageKey|string = 'paths'
) : PathSegmentsReturn<ContextType, StorageKey|string> {

    return ((context : Context) => ContextPathSegments(context, storage)) as PathSegmentsReturn<ContextType, StorageKey|string>;
}

