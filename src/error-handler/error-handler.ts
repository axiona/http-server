import Context from '../context/context';
import Router from '../router/router';

export default interface ErrorHandler<Argument extends Context = Context, Return extends Context = Argument> {

    register ?: (context: Router) => void;
    (error: Error, context: Argument) : Return|Promise<Return|void>|void;
}
