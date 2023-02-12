import Metadata from './metadata.js';
import Registrable from '../../registrable.ts/registrable.js';

export default function Register(metadata: Metadata, middleware: Registrable) : Metadata {

    if(middleware.register) {

        return middleware.register(metadata);
    }

    return metadata;
}