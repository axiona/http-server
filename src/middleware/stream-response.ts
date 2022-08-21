import Context from "../context/context";
import Callable from '@alirya/function/callable';
import Middleware from "./middleware";
import Union from '@alirya/promise/union';
import { Readable } from 'stream';
import FromReadable from "../context/from-readable";

export type StreamResponseCallbackType = Readable|{
    readable: Readable,
    mime?: string
};

export default function StreamResponse<
    Ctx extends Context
>(
    option: Callable<[Ctx], Union<StreamResponseCallbackType>>
) : Middleware<Ctx, Ctx & {response:{body:Readable}}> {

    return async function (context) {

        let {readable, mime} = StreamResponseUnpackArgument(await option(context));

        return FromReadable(context, readable, mime);
    };

}


export function StreamResponseUnpackArgument<Ctx extends Context> (
    argument : StreamResponseCallbackType
) : Exclude<StreamResponseCallbackType, Readable> {

    if(argument instanceof Readable) {

        return { readable: argument };

    } else {

        return argument;

    }
}