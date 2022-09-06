import {ListenOptions} from "net";

export default function MessageConnected(option: ListenOptions) : string {

    return `http server listening to port ${option.port}`;
}

