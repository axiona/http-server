import Clone from "./clone";
import Middleware from "../../middleware/middleware";
import Metadata from "./metadata";
import Register from "./register";


export default function AppendChildren<MiddlewareType extends Middleware>(metadata: Metadata, middleware: MiddlewareType) : Metadata {

    let clone = Clone(metadata, {});

    clone = Register(clone, middleware);

    // clone.middleware = middleware;
    clone.parent = metadata;

    metadata.children.push(clone);

    return clone;
}