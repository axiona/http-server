import Server from './server.js';
import Standard from './standard.js';
import Cors from '@koa/cors';

export default function CorsBody(server : Server = new Standard()) {

    server.koa.use(Cors());

    return server;
}
