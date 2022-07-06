import {DefaultContext, DefaultState, ExtendableContext} from 'koa';
import RouterType from '../router/router.js';

/**
 * context of parameter middleware
 */
type Context<
    Request = unknown,
    Response = unknown,
    Router = {},
    State extends DefaultState = DefaultState,
    Context extends DefaultContext = DefaultContext,
> = ExtendableContext & {
    response : Response,
    request : Request,
    router : RouterType & Router
};

export default Context;

