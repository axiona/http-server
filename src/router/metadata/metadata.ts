import Request from "@axiona/http/request/request.js";
import Matcher from '../../matcher/matcher.js';


export default interface Metadata extends Omit<Request, 'method'|'body'|'path'> {

    method: string[];
    path: Matcher;
    children : Metadata[];
}
