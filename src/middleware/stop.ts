import Context from '../context/context';
import Middleware from "./middleware";
import Callable from '@alirya/function/callable';

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
