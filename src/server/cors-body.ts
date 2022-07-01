import Server from './server';
import Standard from './standard';
import Cors from '@koa/cors';

export default function CorsBody(server : Server = new Standard()) {

    server.koa.use(Cors());

    return server;
}
