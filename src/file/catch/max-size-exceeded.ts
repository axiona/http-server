import Catch from '../../catch/catch.js';
import Context from '../../context/context.js';
import Formidable /*{errors}*/ from "formidable";
import Middleware from '../../middleware/middleware.js';
import Code from './code.js';

const errors = Formidable.errors;
export default function MaxSizeExceeded<ContextType extends Context = Context> (
    middleware: Middleware<ContextType>
) : Catch<ContextType> {

    return Code(errors.biggerThanMaxFileSize, middleware)
}