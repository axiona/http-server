import {ServerResponse} from "http";


export default function ResponseEnd(response: ServerResponse) : Promise<void> {

    return (new Promise<void>((resolve, reject) => {
        // resolve();
        response.once('close', resolve);
        response.once('finish', resolve);
        response.once('end', resolve);
    }));

    // const responseFinish = new Promise<void>((resolve, reject) => {
    //     response.on('finish', resolve);
    // });
    //
    // return Promise.race([responseFinish, responseClose]);
}