import Catch from "../../catch/catch";
import Context from "../../context/context";
import {errors} from "formidable";
import Middleware from "../../middleware/middleware";
import Code from "./code";

export default function MaxSizeExceeded<ContextType extends Context = Context> (
    middleware: Middleware<ContextType>
) : Catch<ContextType> {

    return Code(errors.biggerThanMaxFileSize, middleware)
}