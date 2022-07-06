import Koa, {DefaultContext, DefaultState} from 'koa';
import Server from './server.js';
import {Server as HttpServer} from 'http';
import {ListenOptions} from 'net';

export default class Listenable<StateT = DefaultState, CustomT = DefaultContext> implements Server<StateT, CustomT> {

    #server : Server<StateT, CustomT>;

    constructor(
        server : Server<StateT, CustomT>,
        public openCallback : (port:ListenOptions) => void,
        public closeCallback : (port:ListenOptions) => void,
    ) {

        this.#server = server;
    }

    get config() : ListenOptions {

        return this.#server.config;
    }


    get koa () : Koa<StateT, CustomT> {

        return this.#server.koa;
    }

    get server() : HttpServer|undefined {

        return this.#server.server;
    }

    open () {

        const server = this.#server.server;

        this.#server.open();

        if(!server) {

            this.openCallback(this.config);
        }
    }

    close() {

        const server = this.#server.server;

        this.#server.close();

        if(server) {

            this.closeCallback(this.config);
        }

    }
}
