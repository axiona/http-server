import Metadata from './metadata.js';
import CloneRecursive from '@alirya/object/clone-recursive.js';

export default function Clone(parameter: Metadata, replace: Partial<Metadata> = {}) : Metadata {

    return Object.assign(
        CloneRecursive(parameter),
        {
            method: Array.from(parameter.method),
            path: parameter.path,
            children:[],
        },
        replace
    );
}