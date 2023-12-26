import {ListParameter, ListType} from "@axiona/uri/path/list.js";

export default function List(paths : string[]|string) : ListType {

    return ListParameter({
        segments : paths,
        empty : false,
        separators : '/\\',
        prefix: true
    });
}
