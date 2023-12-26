import Context from '../context/context.js';
import Middleware from './middleware.js';
import Callable from '@axiona/function/callable.js';

export default function Stop<ContextType extends Context>() : Callable<[ContextType], void>;
export default function Stop<ContextType extends Context, CtxtNext extends Context>(context : Middleware<ContextType, CtxtNext>) : Middleware<ContextType, CtxtNext>;
export default function Stop<ContextType extends Context>(m ?: Middleware) : Callable<[ContextType], void> {

    if(m) {

        return function (context) {
            m(context);
        };
    } else {

        return function (context) {};
    }
}
