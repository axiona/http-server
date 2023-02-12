import {DefaultContext, DefaultState, ExtendableContext} from 'koa';
import Metadata from '../router/metadata/metadata.js';

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
    router ?: Metadata & Router
};

export default Context;

