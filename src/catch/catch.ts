import Context from '../context/context';
import Router from '../router/router';
import Union from '@alirya/promise/union';

export default interface Catch<Argument extends Context = Context> {

    register ?: (context: Router) => void;
    (context: Argument, error: Error) : Union<void>;
}
