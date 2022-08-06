import Catch from "../../catch/catch";
import Context from "../../context/context";
import FormidableError from "../boolean/formidable-error";
import {errors} from "formidable";
import {ErrorParameters} from "../../catch/error";
import Middleware from "../../middleware/middleware";

export default function MaxSizeExceeded<ContextType extends Context = Context> (
    middleware: Middleware<ContextType>
) : Catch<ContextType> {

    return ErrorParameters(function (error: Error) {

        return FormidableError(error) && (error.code === errors.biggerThanMaxFileSize);

    }, middleware);

}