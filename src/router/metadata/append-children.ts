import Clone from './clone.js';
import Middleware from '../../middleware/middleware.js';
import Metadata from './metadata.js';

export default function AppendChildren<MiddlewareType extends Middleware>(registers: (metadata: Metadata) => Metadata, metadata: Metadata/*, middleware: MiddlewareType*/) : Metadata {

    const clone = registers(
        Clone(metadata, {})
    );

    metadata.children.push(clone);

    return clone;
}