import Context from '../context/context.js';
import Union from '@axiona/promise/union.js';
import Registrable from '../registrable.ts/registrable.js';

export default interface Catch<Argument extends Context = Context, ErrorType extends Error = Error> extends Registrable {

    (context: Argument, error: ErrorType) : Union<void>;
}
