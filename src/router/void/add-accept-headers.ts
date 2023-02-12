import {Headers} from "headers-polyfill";
import Metadata from '../metadata/metadata.js';

// TODO MOVE TO HTTP PACKAGE
export default function AddAcceptHeaders(router: Metadata, contentType: string) {

    const header = new Headers(router.headers);

    const accept = header.get('Accept');

    const [mime, q] = contentType.split(';', 2);

    if(!accept || (accept.search(mime) === -1)) {

        header.append('Accept', contentType);

    }

    router.headers = header.all();

}