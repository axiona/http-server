import Router from "../router";
import {Headers} from "headers-polyfill";

export default function AddAcceptHeaders(router: Router, contentType: string) {

    const header = new Headers(router.metadata.headers);
    header.append('Accept', contentType);
    router.metadata.headers = header.all();
}