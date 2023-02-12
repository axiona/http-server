import Metadata from '../metadata.js';

export function FromRouterArray(metadata: Metadata, container: Set<Metadata>) : Set<Metadata> {

    container.add(metadata);

    for (const value of metadata.children) {

        FromRouterArray(value, container);
    }

    return container;
}

export default function FromRouter(metadata: Metadata) : Metadata[] {

    const set = FromRouterArray(metadata, new Set<Metadata>());
    return Array.from(set);
}