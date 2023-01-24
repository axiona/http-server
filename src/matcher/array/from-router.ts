import MetadataFromRouter from "../../router/metadata/array/from-router";
import Matcher from "../matcher";
import Metadata from "../../router/metadata/metadata";

export default function FromRouter(router: Metadata) : Matcher[] {

    return MetadataFromRouter(router).map(metadata=>metadata.path);
}