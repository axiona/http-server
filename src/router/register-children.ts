import Router from "./router";
import MiddlewareCatch from "./catch";
import Clone from "./metadata/clone";
import Metadata from "./metadata/metadata";

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