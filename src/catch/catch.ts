import Context from '../context/context';
import Router from '../router/router';
import Union from '@alirya/promise/union';
import Error from "./error";

export default interface Catch<Argument extends Context = Context, ErrorType extends Error = Error> {

    register ?: (context: Router) => void;
    (context: Argument, error: ErrorType) : Union<void>;
}
