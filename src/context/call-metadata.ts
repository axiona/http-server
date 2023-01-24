import Metadata from "../router/metadata/metadata";
import Context from "./context";


export default async function CallMetadata(metadata : Metadata, context : Context) {

    // context.router = metadata;
    // const contextNext = await metadata.middleware(context);
    //
    // if(contextNext) {
    //
    //     for (const next of metadata.children) {
    //         await CallMetadata(next, contextNext);
    //         // contextNext.router = next;
    //         // await next.middleware(contextNext);
    //     }
    //
    //     contextNext.router = metadata;
    // }
    //
    // return contextNext;

}