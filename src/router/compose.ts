import ErrorHandlerType from '../catch/catch';
import Context from '../context/context';
import Router from './router';
import MiddlewareRouter from './middleware';
import MiddlewareCatch from './catch';
import Catch from '../catch/catch';
import Middleware from '../middleware/middleware';
import Metadata from "./metadata/metadata";
import AppendChildren from "./metadata/append-children";
import Identity from "../../../function/dist/identity";
import Clone from "./metadata/clone";
import Root from "./root";
import Register from "./metadata/register";

let rr = 1;
let ra = 1;

export default function Compose<
    ContextType extends Context  = Context,
    Error extends Catch  = Catch,
> (
    metadata : Metadata,
    children : Router[],
    callback : Omit<Middleware, 'register'>,
    registers : (meta: Metadata) => Metadata = Identity,
    parent : Middleware|null,
) : Pick<Router<ContextType>, 'metadata'|'register'|'catch'|'add'>  {

    let route: Pick<Router<ContextType>, 'metadata'|'parent'|'children'> = Object.assign(callback, {
        parent,
        metadata,
        children
    }) as Pick<Router<ContextType>, 'metadata'|'parent'|'children'>;

    route = Object.assign(route, {
        register : (meta: Metadata) : Metadata => {

            const metaNext = (registers((meta)));

            for (const value of children) {

                let router = Register(Clone(metaNext), value);
                router.parent = metaNext;
                // metaNext.rr = rr++;
                metaNext.children.push(router);
            }

            // for (const value of children) {
            //     value.rr = rr++;
            //     metaNext.rr = rr++;
            //     AppendChildren(metaNext, value);
            // }

            return metaNext;
        },
        add : <Next extends Context>(next : Middleware<ContextType, Next>) => {

            const router = MiddlewareRouter(next, Clone(metadata), route as Router<ContextType>);
            metadata.children.push(router.metadata);
            // router.metadata.ra = ra++;
            children.push(router);

            return router;

            let nextMetadata = AppendChildren(metadata, router);
            children.push(router);
            // nextMetadata.ra = ra++;
            // router.ra = ra++;
            return router as Router<Next> ;
        },
        catch : (errorHandler : ErrorHandlerType) => {

            let nextMetadata = (metadata);
            const router =  MiddlewareCatch(errorHandler, nextMetadata);

            children.push(router);

            return router;
        },
        // get root  ()   {
        //     return Root(route as Router<ContextType>);
        // }

    }) as Router<ContextType>;

    return route as Router<ContextType>;
}



//
// export default function Compose<
//     ContextType extends Context  = Context,
//     Error extends Catch  = Catch,
// > (
//     metadata : Metadata,
//     children : Router[],
//     callback : Omit<Middleware, 'register'>,
//     registers : (meta: Metadata) => Metadata = Identity,
//     parent : Middleware|null,
// ) : Pick<Router<ContextType>, 'metadata'|'register'|'catch'|'add'>  {
//
//
//     const register = (meta: Metadata) : Metadata => {
//
//         const metaNext = registers(meta);
//
//         for (const value of children) {
//
//             AppendChildren(metaNext, value);
//         }
//
//         return metaNext;
//     };
//
//
//     const add = <Next extends Context>(next : Middleware<ContextType, Next>) => {
//
//         let nextMetadata = AppendChildren(metadata, next);
//         const router = MiddlewareRouter(next, nextMetadata, callback);
//         children.push(router);
//
//         return router as Router<Next> ;
//     };
//
//     const catches = (errorHandler : ErrorHandlerType) => {
//
//         let nextMetadata = (metadata);
//         const router =  MiddlewareCatch(errorHandler, nextMetadata);
//
//         children.push(router);
//
//         return router;
//     };
//
//
//     return Object.assign(callback, {metadata, register, catch:catches, add, parent, children,        get root  ()   {
//
//         return Root(callback);
//
//         } }) as Pick<Router<ContextType>, 'metadata'|'register'|'catch'|'add'>;
// }
//
//
//

//
//
// export default function Compose<
//     ContextType extends Context  = Context,
//     Error extends Catch  = Catch,
// > (
//     metadata : Metadata,
//     children : Router[],
//     callback : Omit<Middleware, 'register'>,
//     registers : (meta: Metadata) => Metadata = Identity,
//     parent : Middleware|null,
// ) : Pick<Router<ContextType>, 'metadata'|'register'|'catch'|'add'>  {
//
//     const register = (meta: Metadata) : Metadata => {
//
//         const metaNext = registers(meta);
//
//         for (const value of children) {
//
//             AppendChildren(metaNext, value);
//         }
//
//         return metaNext;
//     };
//
//
//     const add = <Next extends Context>(next : Middleware<ContextType, Next>) => {
//
//         let nextMetadata = AppendChildren(metadata, next);
//         const router = MiddlewareRouter(next, nextMetadata, callback);
//         children.push(router);
//
//         return router as Router<Next> ;
//     };
//
//     const catches = (errorHandler : ErrorHandlerType) => {
//
//         let nextMetadata = (metadata);
//         const router =  MiddlewareCatch(errorHandler, nextMetadata);
//
//         children.push(router);
//
//         return router;
//     };
//
//
//     return Object.assign(callback, {metadata, register, catch:catches, add, parent, children,        get root  ()   {
//
//         return Root(callback);
//
//         } }) as Pick<Router<ContextType>, 'metadata'|'register'|'catch'|'add'>;
// }

//
//
//
//
//
// export function Composez<
//     ContextType extends Context  = Context,
//     Error extends Catch  = Catch,
// > (
//     metadata : Metadata,
//     children : Router[],
//     callback : Omit<Middleware, 'register'>,
//     registers : (meta: Metadata) => Metadata = Identity,
//     parent : Middleware|null,
//     // root : Middleware|null,
// ) : Pick<Router<ContextType>, 'metadata'|'register'|'catch'|'add'>  {
//
//     const register = (meta: Metadata) : Metadata => {
//
//         // const a =  Compose(meta);
//
//         const metaNext = registers(meta);
//         // const metaNext = meta;
//
//         for (const value of children) {
//
//             AppendChildren(metaNext, value);
//         }
//
//         return metaNext;
//     };
//
//     const add = <Next extends Context>(next : Middleware<ContextType, Next>) => {
//
//
//
//
//         // let meta = next.register ? next.register(Clone(metadata, {middleware:next})) : Clone(metadata, {middleware:next});
//         // const routerz1 = MiddlewareRouter(meta);
//         //
//         // // AppendChildren(metadata, routerz1);
//         // //
//         // // return routerz1;
//         //
//         // // meta.middleware = next;
//         // meta.parent = metadata;
//         // metadata.children.push(routerz1);
//         // const r = MiddlewareRouter(meta);
//         // return r as Router<Next> ;
//
//
//
//         // let nextMetadata = Clone(metadata, {middleware:next});
//         // let routerz = MiddlewareRouter(nextMetadata);
//         // nextMetadata.middleware = next;
//         let nextMetadata = AppendChildren(metadata, next);
//         const router = MiddlewareRouter(next, nextMetadata, this, this);
//         children.push(router);
//
//         return router as Router<Next> ;
//
//
//
//         // let nextMetadata = /*registers*/(metadata);
//         // // nextMetadata.middleware = next;
//         // nextMetadata = AppendChildren(nextMetadata, next);
//         // const router = MiddlewareRouter(nextMetadata);
//         // // children.push(router);
//         //
//         // return router as Router<Next> ;
//     };
//
//     const catches = (errorHandler : ErrorHandlerType) => {
//
//         let nextMetadata = /*registers*/(metadata);
//         const router =  MiddlewareCatch(errorHandler, nextMetadata);
//
//         children.push(router);
//
//         return router;
//     };
//
//
//     return Object.assign(callback, {metadata, register, catch:catches, add, parent}) as Pick<Router<ContextType>, 'metadata'|'register'|'catch'|'add'>;
// }
//
//
//
//







//
// export default function Compose<
//     ContextType extends Context  = Context,
//     Error extends Catch  = Catch,
// > (
//     metadata : Metadata,
//     children : Router[],
//     callback : Omit<Middleware, 'register'>,
//     registers : (meta: Metadata) => Metadata = Identity,
// ) : Pick<Router<ContextType>, 'metadata'|'register'|'catch'|'add'>  {
//
//     const register = (meta: Metadata) : Metadata => {
//
//         // const a =  Compose(meta);
//
//         const metaNext = registers(meta);
//         // const metaNext = meta;
//
//         for (const value of children) {
//
//             AppendChildren(metaNext, value);
//         }
//
//         return metaNext;
//     };
//
//     const add = <Next extends Context>(next : Middleware<ContextType, Next>) => {
//
//
//
//
//         // let meta = next.register ? next.register(Clone(metadata, {middleware:next})) : Clone(metadata, {middleware:next});
//         // const routerz1 = MiddlewareRouter(meta);
//         //
//         // // AppendChildren(metadata, routerz1);
//         // //
//         // // return routerz1;
//         //
//         // // meta.middleware = next;
//         // meta.parent = metadata;
//         // metadata.children.push(routerz1);
//         // const r = MiddlewareRouter(meta);
//         // return r as Router<Next> ;
//
//
//
//         // let nextMetadata = Clone(metadata, {middleware:next});
//         // let routerz = MiddlewareRouter(nextMetadata);
//         // nextMetadata.middleware = next;
//         let nextMetadata = AppendChildren(metadata, next);
//         const router = MiddlewareRouter(next, nextMetadata);
//         children.push(router);
//
//         return router as Router<Next> ;
//
//
//
//         // let nextMetadata = /*registers*/(metadata);
//         // // nextMetadata.middleware = next;
//         // nextMetadata = AppendChildren(nextMetadata, next);
//         // const router = MiddlewareRouter(nextMetadata);
//         // // children.push(router);
//         //
//         // return router as Router<Next> ;
//     };
//
//     const catches = (errorHandler : ErrorHandlerType) => {
//
//         let nextMetadata = /*registers*/(metadata);
//         const router =  MiddlewareCatch(errorHandler, nextMetadata);
//
//         children.push(router);
//
//         return router;
//     };
//
//
//     return Object.assign(callback, {metadata, register, catch:catches, add}) as Pick<Router<ContextType>, 'metadata'|'register'|'catch'|'add'>;
// }
//
