import Metadata from "./metadata";
import FromPath from "../../matcher/from-path";

const path = FromPath('');

export default function Null() : Metadata {

    return  {
        headers: {},
        method: [],
        children: [],
        parent: null,
        path,
    };
}