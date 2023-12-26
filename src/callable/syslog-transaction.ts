import Syslog from '@axiona/syslog/syslog.js';
import Callable from '@axiona/function/callable.js';
import {Request, Response} from "koa";


export default function SyslogTransaction<
    Arguments extends unknown[],
    Log extends Syslog<Arguments>
>(
    syslog: Log,
    transaction : Callable<[Request, Response], Arguments>,
    severity : keyof Syslog = 'debug'
) : Callable<[Request, Response], void> {

    return function (request, response) {

        // console.log(transaction(request, response));;
        syslog[severity](...transaction(request, response));
    };
}
