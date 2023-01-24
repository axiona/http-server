import Metadata from "./metadata";
import CloneRecursive from '@alirya/object/clone-recursive';

export default function Clone(parameter: Metadata, replace: Partial<Metadata> = {}) : Metadata {

    // let c =  Object.assign(
    //     CloneRecursive(parameter),
    //     {path: parameter.path});

    return Object.assign(
        CloneRecursive(parameter),
        {
            method: Array.from(parameter.method),
            path: parameter.path,
            // headers: {},
            children:[],
            parent: null,
            // root: parameter.root
        },
        replace
    );
}