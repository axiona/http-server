import Context from "./context";
import createHttpError from "http-errors";

export default function FromError<Ctx extends Context>(context: Ctx, error: Error) : Ctx {

    const httpError = createHttpError(error);

    context.response.status = httpError.status;
    context.response.body = httpError.message;

    return context;
}