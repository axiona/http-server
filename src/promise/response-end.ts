import {ServerResponse} from "http";


export default function ResponseEnd(response: ServerResponse) : Promise<void> {

    const responseClose = new Promise<void>((resolve, reject) => {
        response.on('close', resolve);
    });

    const responseFinish = new Promise<void>((resolve, reject) => {
        response.on('finish', resolve);
    });

    return Promise.race([responseFinish, responseClose]);
}