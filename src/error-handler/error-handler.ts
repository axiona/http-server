import Context from '../context/context.js';
import Router from '../router/router.js';

export default interface ErrorHandler<Argument extends Context = Context, Return extends Context = Argument> {

    register ?: (context: Router) => void;
    (error: Error, context: Argument) : Return|Promise<Return|void>|void;
}
