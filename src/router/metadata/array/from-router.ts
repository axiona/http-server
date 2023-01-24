import Metadata from "../metadata";
import Router from "../../router";

export function FromRouterArray(metadata: Metadata, container: Set<Metadata>) : Set<Metadata> {

    container.add(metadata);

    for (const value of metadata.children) {

        FromRouterArray(value, container);
    }

    return container;

    // return Array.from(new Set(FromRouterArray(router)));
}

export default function FromRouter(metadata: Metadata) : Metadata[] {

    const set = FromRouterArray(metadata, new Set<Metadata>());
    return Array.from(set);

    // yield metadata;
    //
    // for (const meta of metadata.children) {
    //
    //     yield * FromRouter(meta);
    // }

}

// export default function FromRouter(router: Router) : Metadata[] {
//
//     return Array.from(new Set(FromRouterArray(router)));
// }
//
// export function FromRouterArray(router: Router) : Metadata[] {
//
//     const parameters : Metadata[] = [];
//
//     parameters.push(router.metadata);
//
//     for (const children of router.children) {
//
//         parameters.push(...FromRouterArray(children));
//     }
//
//     return parameters;
// }