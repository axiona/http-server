// import ErrorHandlerType from '../catch/catch';
// import Context from '../context/context';
// import Router from './router';
// import Catch from '../catch/catch';
// import Callable from '@alirya/function/callable';
// import Middleware, {MiddlewareInferCurrent, MiddlewareInferNext} from '../middleware/middleware';
// import Metadata from "./metadata/metadata";
// import Null from "./metadata/null";
// import Clone from "./metadata/clone";
// import Error from "../catch/error";
// import Union from '@alirya/promise/union';
// import Next from "../middleware/next";
// import Constant from "../../../function/dist/constant";
// import Identity from "../../../function/dist/identity";
// //
// // export default class Standard<
// //     ContextType extends Context  = Context,
// //     // Type extends Middleware  = Middleware,
// //     Error extends Catch  = Catch,
// // > implements Router<ContextType, Error> {
// //
// //     children : Router[] = [];
// //
// //     constructor(
// //         public middleware : Middleware<Context, ContextType>|undefined = undefined,
// //         public error : Error|undefined = undefined,
// //         public parent : Router|undefined = undefined,
// //         public metadata : Metadata = Null(),
// //     ) {
// //
// //         for(const handler of [middleware, error]) {
// //
// //             if(handler && handler.register) {
// //
// //                 handler.register(this);
// //             }
// //         }
// //     }
// //
// //     extends<
// //         ENext extends Context,
// //         NextError extends Catch  = Catch,
// //     >(
// //         router: Callable<[this], Router<ENext, NextError>>
// //     ) : Router<ENext, NextError> {
// //
// //         return router(this);
// //     }
// //
// //     add<Next extends Context>(middleware : Middleware<ContextType, Next>) : Router<Next> {
// //
// //         const router = new Standard(middleware, undefined, this, Clone(this.metadata));
// //
// //         this.children.push(router);
// //
// //         return router as Router<Next> ;
// //     }
// //
// //     catch(errorHandler : ErrorHandlerType) {
// //
// //         const router =  new Standard(undefined, errorHandler, this, Clone(this.metadata));
// //
// //         this.children.push(router);
// //
// //         return router;
// //     }
// //
// //     async call(context: Context) : Promise<Context|void> {
// //
// //         // context.router = this;
// //
// //         if(this.middleware) {
// //
// //             try {
// //
// //                 context.router = this;
// //
// //                 context = await (this.middleware as Middleware)(context) as Context;
// //                 // return await callable();
// //
// //             } catch (error) {
// //
// //                 if(this.error) {
// //
// //                     await this.error(context, error);
// //
// //                 } else {
// //
// //                     throw error;
// //                 }
// //             }
// //
// //             // context = await this.tryExecute(()=> {
// //
// //             // }, context) as Context;
// //         }
// //
// //
// //         if(context) {
// //
// //             for (const children of this.children) {
// //
// //                 try {
// //
// //                     context.router = this;
// //
// //                     await children.call(context);
// //
// //                 } catch (error) {
// //
// //                     if(this.error) {
// //
// //                         await this.error(context, error);
// //
// //                     } else  {
// //
// //                         throw error;
// //                     }
// //                 }
// //
// //                 // await this.tryExecute(()=> {
// //
// //                     // context.router = this;
// //                     //
// //                     // return  children.call(context);
// //
// //                 // }, context) as Context;
// //             }
// //
// //             // return context as Context;
// //
// //         }
// //
// //         return context;
// //     }
// //
// // }
//
//
//
//
// export default function Standard<
//     ContextType extends Context  = Context,
//     // ContextNext extends Context  = Context,
//     // Type extends Middleware  = Middleware,
//     Error extends Catch  = Catch,
// > (
//     middleware : Middleware<Context, ContextType> = Identity as Middleware<Context, ContextType>,
//     metadata : Metadata = Null(),
// ) : Router<ContextType>  {
//
//     type Data = {
//         metadata : Metadata,
//     };
//
//     const data : Data  = {
//         metadata,
//     };
//
//     const children : Router[] = [];
//
//     const routing : Data = Object.assign(async function (context : Context) {
//
//         const contextNext = await middleware(context);
//
//         if(contextNext) {
//
//             for (const next of children) {
//
//                 await next(contextNext);
//             }
//         }
//
//         return contextNext;
//
//     }, data);
//
//     const add = <Next extends Context>(next : Middleware<ContextType, Next>) => {
//
//         const router = Standard(next, Clone(data.metadata));
//         children.push(router);
//
//         return router as Router<Next> ;
//     };
//
//     const catches = (errorHandler : ErrorHandlerType) => {
//
//         const router =  StandardCatch(errorHandler, Clone(data.metadata));
//
//         children.push(router);
//
//         return router;
//     };
//
//
//     return Object.assign(routing, {add, catch:catches})  as Router<ContextType>;
// }
//
//
//
// export function StandardCatch<
//     ContextType extends Context  = Context,
//     // ContextNext extends Context  = Context,
//     // Type extends Middleware  = Middleware,
//     Error extends Catch  = Catch,
// > (
//     errorHandler : ErrorHandlerType,
//     metadata : Metadata = Null(),
// ) : Router<ContextType>  {
//
//     type Data = {
//         metadata : Metadata,
//     };
//
//     const data : Data  = {
//         metadata,
//     };
//
//     const children : Router[] = [];
//
//     const routing : Data = Object.assign(async function (context : Context) {
//
//             for (const next of children) {
//
//                 try {
//                     await next(context);
//                 } catch (error) {
//                     errorHandler(context, error);
//                 }
//             }
//
//     }, data);
//
//     const add = <Next extends Context>(next : Middleware<ContextType, Next>) => {
//
//         const router = Standard(next, Clone(data.metadata));
//
//         children.push(router);
//
//         return router as Router<Next> ;
//     };
//
//     const catches = (errorHandler : ErrorHandlerType) => {
//
//         const router =  StandardCatch(errorHandler, Clone(data.metadata));
//
//         children.push(router);
//
//         return router;
//     };
//
//
//     return Object.assign(routing, {add, catch:catches})  as Router<ContextType>;
// }
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// function Router<
//     Current extends Middleware,
//     Next extends Middleware<MiddlewareInferNext<Current>>
// >(
//     current : Current,
//     middleware : Next
// ) : Middleware<MiddlewareInferCurrent<Current>, MiddlewareInferNext<Next>> {
//
//     return async function (context : MiddlewareInferCurrent<Current>) {
//
//         const result  =  await current(context);
//
//         if(result) {
//
//             return middleware(result as MiddlewareInferNext<Current>) as MiddlewareInferNext<Next>;
//         }
//     };
// }
//
// function add<
//     Current extends Middleware,
//     Next extends Middleware<MiddlewareInferNext<Current>>
// >(
//     current : Current,
//     middleware : Next
// ) : Middleware<MiddlewareInferCurrent<Current>, MiddlewareInferNext<Next>> {
//
//     return async function (context : MiddlewareInferCurrent<Current>) {
//
//         const result  =  await current(context);
//
//         if(result) {
//
//             return middleware(result as MiddlewareInferNext<Current>) as MiddlewareInferNext<Next>;
//         }
//     };
// }
//
// function Catches<
//     Current extends Middleware,
//     ErrorType extends Error = Error
// >(
//     current  : Current,
//     catches : (context: MiddlewareInferCurrent<Current>, error: ErrorType) => Union<void>
// ) : Current {
//
//     return async function (context: MiddlewareInferCurrent<Current>) {
//
//         try {
//
//         return await current(context);
//
//         } catch (error) {
//
//             catches(context, error);
//         }
//
//     } as Current;
// }
//
// // export default interface Catch<Argument extends Context = Context, ErrorType extends Error = Error> {
// //
// //     register ?: (context: Router) => void;
// //     (context: Argument, error: ErrorType) : Union<void>;
// // }
