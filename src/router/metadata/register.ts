import Clone from "./clone";
import Middleware from "../../middleware/middleware";
import Metadata from "./metadata";

export default function Register<MiddlewareType extends Pick<Middleware, 'register'>>(metadata: Metadata, middleware: MiddlewareType) : Metadata {

    if(middleware.register) {

        return middleware.register(metadata);
    }

    return metadata;
}