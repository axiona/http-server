import Request from "@alirya/http/request/request";
import Matcher from "../../matcher/matcher";
import Middleware from "../../middleware/middleware";


export default interface Metadata extends Omit<Request, 'method'|'body'|'path'> {

    method: string[];
    path: Matcher;
    // middleware: Middleware;
    children : Metadata[];
    parent : Metadata|null;
    // root : Metadata|null;
}