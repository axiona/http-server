import Context from '../context/context';
import Router from './router';
import Catch from '../catch/catch';
import Middleware from '../middleware/middleware';
import Metadata from "./metadata/metadata";
import Null from "./metadata/null";
import Identity from "../../../function/dist/identity";
import Compose from "./compose";
import AppendChildren from "./metadata/append-children";
import CallMetadata from "../context/call-metadata";
import Register from "./metadata/register";
import Clone from "./metadata/clone";

let mr = 1;

export default function Middleware<
    ContextType extends Context  = Context,
    Error extends Catch  = Catch,
> (
    middleware : Middleware<Context, ContextType> = Identity as Middleware<Context, ContextType>,
    metadata : Metadata = Null(),
    parent : Middleware|null = null,
    // root : Middleware|null = null,
) : Router<ContextType>  {

    const children : Router[] = [];

    let nextMetadata = Register(metadata, middleware);

    const register = (meta : Metadata) : Metadata => {

        // let m =  AppendChildren(meta, middleware);
        let m =  Register(Clone(meta), middleware);

        // m.mr = mr++;
        return m;
    };

    const callback = async function (context : Context) {

        context.router = nextMetadata;
        const contextNext = await middleware(context);

        if(contextNext) {

            for (const next of children) {
                // contextNext.router = metadata;
                await next(contextNext);
            }

            // contextNext.router = metadata;
        }

        return contextNext;
    };

    return Compose(nextMetadata, children, callback, register, parent) as Router<ContextType> ;

}

//
// export default function Middleware<
//     ContextType extends Context  = Context,
//     Error extends Catch  = Catch,
// > (
//     middleware : Middleware<Context, ContextType> = Identity as Middleware<Context, ContextType>,
//     metadata : Metadata = Null(),
// ) : Router<ContextType>  {
//
//     const children : Router[] = [];
//
//     // metadata = AppendChildren(metadata, middleware);
//
//     // return Compose(metadata, async function (context : Context) {
//     //
//     //     return CallMetadata(metadata, context);
//     //
//     // }, (meta) => {
//     //
//     //     return AppendChildren(meta, metadata.middleware);
//     //
//     // }) as Router<ContextType> ;
//
//
//     return Compose(metadata, children,async function (context : Context) {
//
//         context.router = metadata;
//         const contextNext = await middleware(context);
//
//         if(contextNext) {
//
//             for (const next of children) {
//                 contextNext.router = metadata;
//                 await next(contextNext);
//             }
//
//             contextNext.router = metadata;
//         }
//
//         return contextNext;
//
//     }, (meta) => {
//         //
//         // return metadata.middleware.register ? metadata.middleware.register(meta) : meta;
//         //
//         // return AppendChildren(meta, metadata.middleware);
//         // return metadata.middleware.register ? metadata.middleware.register(meta) : meta;
//
//         return AppendChildren(meta, middleware);
//
//     }) as Router<ContextType> ;
//
// }
