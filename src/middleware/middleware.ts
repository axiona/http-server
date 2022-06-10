import Context from '../context/context';
import Router from '../router/router';
import BaseReturn from './return/return';

export default interface Middleware<
    Argument extends Context = Context,
    Return extends Context = Argument
> {

    register?:(context: Router) => void;
    /*<Arg extends Argument>*/(context: Argument) : BaseReturn<Return>;
}
