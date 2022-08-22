import Metadata from "../metadata";
import Router from "../../router";

export default function FromRouter(router: Router) : Metadata[] {

    return Array.from(new Set(FromRouterArray(router)));
}

export function FromRouterArray(router: Router) : Metadata[] {

    const parameters : Metadata[] = [];

    parameters.push(router.metadata);

    for (const children of router.children) {

        parameters.push(...FromRouterArray(children));
    }

    return parameters;
}