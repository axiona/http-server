import ErrorHandlerType from '../catch/catch';
import Context from '../context/context';
import Router from './router';
import MiddlewareRouter from './middleware';
import MiddlewareCatch from './catch';
import Catch from '../catch/catch';
import Middleware from '../middleware/middleware';
import Metadata from "./metadata/metadata";
import Identity from "../../../function/dist/identity";
import Clone from "./metadata/clone";
import Register from "./metadata/register";
import RegisterChildren from "./register-children";
import AppendChildren from "./metadata/append-children";

export default function Compose<
    ContextType extends Context  = Context,
    Error extends Catch  = Catch,
> (
    metadata : Metadata,
    children : Router[],
    callback : Omit<Middleware, 'register'>,
    registers : (meta: Metadata) => Metadata = Identity,
    parent : Middleware|null,
) : Pick<Router<ContextType>, 'metadata'|'register'|'catch'|'add'>  {

    let route: Pick<Router<ContextType>, 'metadata'|'parent'|'children'> = Object.assign(callback, {
        parent,
        metadata,
        children
    }) as Pick<Router<ContextType>, 'metadata'|'parent'|'children'>;

    route = Object.assign(route, {
        register : (meta: Metadata) : Metadata => {

            const metaNext = registers(meta);

            for (const value of children) {

                AppendChildren(meta => Register((meta), value), metaNext);
            }

            return metaNext;
        },
        add : <Next extends Context>(next : Middleware<ContextType, Next>) => {

            return RegisterChildren(
                (metadata) => MiddlewareRouter(next, metadata, route as Router<ContextType>),
                metadata,
                children
            );
        },
        catch : (errorHandler : ErrorHandlerType) => {

            return RegisterChildren(
                (metadata) => MiddlewareCatch(errorHandler, Clone(metadata), route as Router<ContextType>),
                metadata,
                children
            );
        },

    }) as Router<ContextType>;

    return route as Router<ContextType>;
}