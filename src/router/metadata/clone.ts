import Metadata from "./metadata";
import CloneRecursive from '@alirya/object/clone-recursive';

export default function Clone(parameter: Metadata) : Metadata {

    return  Object.assign(
        CloneRecursive(parameter),
        {path: parameter.path}
    );
}