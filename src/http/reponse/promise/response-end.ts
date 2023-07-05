import {ServerResponse} from "http";


export default function ResponseEnd(response: ServerResponse) : Promise<void> {

    return (new Promise<void>((resolve, reject) => {
        response.once('close', resolve);
        response.once('finish', resolve);
        response.once('end', resolve);
    }));
}