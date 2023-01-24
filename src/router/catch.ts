import ErrorHandlerType from '../catch/catch';
import Context from '../context/context';
import Router from './router';
import Catch from '../catch/catch';
import Metadata from "./metadata/metadata";
import Null from "./metadata/null";
import Compose from "../router/compose";
import Middleware from '../middleware/middleware';
import Identity from "../../../function/dist/identity";

export default function Catch<
    ContextType extends Context  = Context,
    Error extends Catch  = Catch,
> (
    errorHandler : ErrorHandlerType,
    metadata : Metadata = Null(),
    parent : Middleware|null = null,
) : Router<ContextType>  {



    const children : Router[] = [];

    const callback = async function (context : Context) {

        for (const next of children) {

            try {
                context.router = metadata;

                await next(context);

            } catch (error) {

                errorHandler(context, error);
            }
        }

        context.router = metadata;

    };

    return Compose(metadata, children, callback, Identity, parent) as Router<ContextType>;
}
