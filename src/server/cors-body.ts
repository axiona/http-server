import Server from "./server";
import Standard from "./standard";
import Cors from "@koa/cors";
// import KoaBody from "@dikac/koa-body";
// import Method from "@alirya/http/request/method/enum/method";

export default function CorsBody(server : Server = new Standard()) {

    server.koa.use(Cors());
    // server.koa.use(KoaBody({parsedMethods:[
    //         Method.PATCH,
    //         Method.POST,
    //         Method.PUT,
    //         Method.DELETE,
    //     ]}));

    return server;
}