import Catch from "../../catch/catch";
import Context from "../../context/context";
import FormidableError from "../boolean/formidable-error";
import {errors} from "formidable";
import {ErrorParameters} from "../../catch/error";
import Middleware from "../../middleware/middleware";
import String from "@alirya/string/boolean/string";

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