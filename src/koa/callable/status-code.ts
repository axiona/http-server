import Callable from '@alirya/function/callable.js';
import {Response} from "koa";


export default function StatusCode(validation : Callable<[number], boolean>) : Callable<[Response], boolean> {

    return function (response) {

        return validation(response.status);
    };
}