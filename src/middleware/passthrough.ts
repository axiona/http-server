import Context from '../context/context';
import {Middleware} from "koa";
import Callable from "@alirya/function/callable";

export default function Passthrough<Argument extends Context = Context>(callback: Callable<[Argument]>) : Middleware<Argument, Argument> {

    return function (context) {
        callback(context);
        return  context;
    };
}
