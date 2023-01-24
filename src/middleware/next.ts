import Context from '../context/context';


export default function Next<Ctx extends Context>(context : Ctx) : Ctx {

    return context;

    // if(middleware) {
    //
    //     return async function (context) {
    //
    //         await middleware(context);
    //
    //         return context;
    //
    //     } as MiddlewareType;
    //
    // } else {
    //
    //     return function (context) {
    //
    //         return context;
    //
    //     } as MiddlewareType;
    // }
}

