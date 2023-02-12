import Catch from '../../catch/catch.js';
import Context from '../../context/context.js';
import FormidableError from '../boolean/formidable-error.js';
import Formidable /*{errors}*/ from "formidable";
import {ErrorParameters} from '../../catch/error.js';
import Middleware from '../../middleware/middleware.js';

const errors = Formidable.errors;
/**
 *
 * @param code error from {@see errors}
 * @param middleware
 * @constructor
 */
export default function Code<ContextType extends Context = Context> (
    code: number[]|number,
    middleware: Middleware<ContextType>
) : Catch<ContextType> {

    const codes: number[] =  Array.isArray(code) ? code : [code];

    return ErrorParameters(function (error: Error) {

        if(FormidableError(error)) {

            return codes.includes(error.code);
        }

        return false;

    }, middleware);

}