import Router from "../router";
import {Headers} from "headers-polyfill";

export default function AddAcceptHeaders(router: Router, contentType: string) {

    const header = new Headers(router.metadata.headers);

    const accept = header.get('Accept');

    const [mime, q] = contentType.split(';', 2);

    if(!accept || (accept.search(mime) === -1)) {

        header.append('Accept', contentType);

    }

    router.metadata.headers = header.all();

}