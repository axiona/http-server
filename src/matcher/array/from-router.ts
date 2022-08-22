import MetadataFromRouter from "../../router/metadata/array/from-router";
import Router from "../../router/router";
import Matcher from "../matcher";

export default function FromRouter(router: Router) : Matcher[] {

    return MetadataFromRouter(router).map(metadata=>metadata.path);
}