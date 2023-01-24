// import Router from "../router";
// import Parents from "../array/parents";
// import {ListType} from "@alirya/uri/path/list";
// import {Required} from "utility-types";
// import List from "../../path/list/list";
// import Last from '@alirya/array/value/value/last';
//
// export default function AbsolutePath(router : Router, relative: ListType) : string {
//
//     const parent = Parents(router).filter(parent=>parent.middleware);
//     const parentPaths = AbsolutePathList(parent);
//
//     const absolute = List([parentPaths, ...relative]);
//     return absolute.toString();
// }
//
// export function AbsolutePathList(parents: ReadonlyArray<Required<Router, 'middleware'>>) : string {
//
//     const parent = Last(parents);
//
//     if(parent) {
//
//         return parent.metadata.path.path;
//     }
//
//     return '';
// }
//
