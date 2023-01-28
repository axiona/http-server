import Metadata from "./metadata";
import Registrable from "../../registrable.ts/registrable";

export default function Register(metadata: Metadata, middleware: Registrable) : Metadata {

    if(middleware.register) {

        return middleware.register(metadata);
    }

    return metadata;
}