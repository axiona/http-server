import Metadata from "./metadata";


export default function Root(metadata: Metadata) : Metadata {

    if(metadata.parent) {

        return Root(metadata.parent);
    }

    return metadata;
}