import {ListenOptions} from "net";

export default function MessageDisconnected(option: ListenOptions) : string {

    return `http server closed for port ${option.port}`;
}
