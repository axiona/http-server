import MetadataFromRouter from '../../router/metadata/array/from-router.js';
import Matcher from '../matcher.js';
import Metadata from '../../router/metadata/metadata.js';

export default function FromRouter(router: Metadata) : Matcher[] {

    return MetadataFromRouter(router).map(metadata=>metadata.path);
}