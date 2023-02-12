import Context from '../context/context.js';
import {Middleware} from "koa";
import Callable from "@alirya/function/callable.js";

export default function Passthrough<Argument extends Context = Context>(callback: Callable<[Argument]>) : Middleware<Argument, Argument> {

    return function (context) {
        callback(context);
        return  context;
    };
}
