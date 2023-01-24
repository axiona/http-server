import Metadata from "./metadata";
import FromPath from "../../matcher/from-path";
import Identity from "../../../../function/dist/identity";

const path = FromPath('');

export default function Null() : Metadata {

    return  {
        headers: {},
        method: [],
        children: [],
        parent: null,
        // root: null,
        path,
        // middleware: Identity
    };
}