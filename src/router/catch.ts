import ErrorHandlerType from '../catch/catch';
import Context from '../context/context';
import Router from './router';
import Catch from '../catch/catch';
import Metadata from "./metadata/metadata";
import Null from "./metadata/null";
import Compose from "../router/compose";
import Middleware from '../middleware/middleware';
import Identity from "../../../function/dist/identity";
import Register from "./metadata/register";
import Clone from "./metadata/clone";

export default function Catch<
    ContextType extends Context  = Context,
    Error extends Catch  = Catch,
> (
    errorHandler : ErrorHandlerType,
    metadata : Metadata = Null(),
    parent : Middleware|null = null,
) : Router<ContextType>  {

    const children : Router[] = [];

    let nextMetadata = Register(metadata, errorHandler);

    const register = (meta : Metadata) : Metadata => {

        return Register(meta, errorHandler);
    };

    const callback = async function (context : Context) {

        for (const next of children) {

            try {
                context.router = nextMetadata;
                await next(context);

            } catch (error) {

                context.router = nextMetadata;
                errorHandler(context, error);
            }
        }

        context.router = nextMetadata;

    };

    return Compose(nextMetadata, children, callback, register, parent) as Router<ContextType>;
}
