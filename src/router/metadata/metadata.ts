import Request from "@alirya/http/request/request";
import Matcher from "../../matcher/matcher";


export default interface Metadata extends Omit<Request, 'method'|'body'|'path'> {

    method: string[];
    path: Matcher;
}