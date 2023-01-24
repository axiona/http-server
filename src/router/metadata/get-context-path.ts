import Context from "../../context/context";
import Metadata from "./metadata";
import FromRouter from "./array/from-router";
// import Root from "../root";
import Standard from "../middleware";
import ContextPath from "../../matcher/match/context-path";
import {UniqueParameters} from '@alirya/array/unique';
import {Headers} from "headers-polyfill";
import Null from "./null";

export default function GetContextPath(context : Context) : Omit<Metadata, 'path'|'children'> {

    const metadatas = FromRouter(context.router || Null())
        .filter(metadata=>ContextPath(metadata.path, context));

    let methods = metadatas
        .flatMap(metadata=>metadata.method)
        .map(method=>method.toUpperCase());

    methods = UniqueParameters(methods);

    const header = new Headers();

    for (const metadata of metadatas) {

        for(const [name, value] of Object.entries(metadata.headers)) {

            header.append(name, value);
        }
    }

    return {method:methods, parent:null, headers: header.all()};
}


// export default function GetContextPath(context : Context) : Omit<Metadata, 'path'> {
//
//     const metadatas = FromRouter(Root(context.router || Standard()))
//         .filter(metadata=>ContextPath(metadata.path, context));
//
//     let methods = metadatas
//         .flatMap(metadata=>metadata.method)
//         .map(method=>method.toUpperCase());
//
//     methods = UniqueParameters(methods);
//
//     const header = new Headers();
//
//     for (const metadata of metadatas) {
//
//         for(const [name, value] of Object.entries(metadata.headers)) {
//
//             header.append(name, value);
//         }
//     }
//
//     return {method:methods, headers: header.all()};
// }
