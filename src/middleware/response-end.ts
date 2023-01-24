import Context from '../context/context';
import Middleware from './middleware';
import Callable from '@alirya/function/callable';

export function ResponseEndParameters<ContextType extends Context>(
    middleware : Middleware<ContextType, ContextType>,
    error : Callable<[Error]> = console.error
) : Middleware<ContextType> {

    return function (context) {

        const responseClose = new Promise<void>((resolve, reject) => {
            context.res.on('close', resolve);
        });

        const responseFinish = new Promise<void>((resolve, reject) => {
            context.res.on('finish', resolve);
        });

        Promise.race([responseFinish, responseClose]).then(()=>{

            middleware(context);

        }).catch(error);

        return context;
    };
}


export function ResponseEndParameter<ContextType extends Context> (
    {
        middleware,
        error = console.error
    } : {
        middleware : Middleware<ContextType, ContextType>
        error ?: Callable<[Error]>,
    }
) {
    return ResponseEndParameters(middleware, error);
}

namespace PrintTransaction {
    export const Parameters = ResponseEndParameters;
    export const Parameter = ResponseEndParameter;
}

export default PrintTransaction;
