// import Context from '../context/context';
// import Middleware from "./middleware";
//
//
// export default function Next<MiddlewareType extends Middleware>(middleware? : MiddlewareType) : MiddlewareType {
//
//     if(middleware) {
//
//         return async function (context) {
//
//             await middleware(context);
//
//             return context;
//
//         } as MiddlewareType;
//
//     } else {
//
//         return function (context) {
//
//             return context;
//
//         } as MiddlewareType;
//     }
// }
//
