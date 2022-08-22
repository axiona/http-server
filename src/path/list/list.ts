import {ListParameter, ListType} from "@alirya/uri/path/list";

export default function List(paths : string[]|string) : ListType {

    return ListParameter({
        segments : paths,
        empty : false,
        separators : '/\\',
        prefix: true
    });
}
