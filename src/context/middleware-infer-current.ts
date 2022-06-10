import Middleware from '../middleware/middleware';

type MiddlewareInferCurrent<Type> = Type  extends Middleware<infer Current, any> ? Current : never;

export default MiddlewareInferCurrent;
