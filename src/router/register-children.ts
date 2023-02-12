import Router from './router.js';
import Clone from './metadata/clone.js';
import Metadata from './metadata/metadata.js';

/**
 * @internal
 */
export default function RegisterChildren<RouterType extends Router>(
    factory: (metadata: Metadata) => RouterType,
    metadata: Metadata,
    children: Router[]
) : RouterType {

    const router =  factory(Clone(metadata));
    metadata.children.push(router.metadata);
    children.push(router);

    return router;
}