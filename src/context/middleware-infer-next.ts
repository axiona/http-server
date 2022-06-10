import Middleware from '../middleware/middleware';

type MiddlewareInferNext<Type> = Type  extends Middleware<any, infer Current> ? Current : never;

export default MiddlewareInferNext;
