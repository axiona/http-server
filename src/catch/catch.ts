import Context from '../context/context';
import Union from '@alirya/promise/union';
import Registrable from "../registrable.ts/registrable";

export default interface Catch<Argument extends Context = Context, ErrorType extends Error = Error> extends Registrable {

    (context: Argument, error: ErrorType) : Union<void>;
}
