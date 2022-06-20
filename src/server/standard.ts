import Koa, {DefaultContext, DefaultState, Middleware} from 'koa';
import {Server as HttpServer} from 'http';
import Server from './server';
import {ListenOptions} from 'net';

export default class Standard<
    StateT = DefaultState,
    CustomT = DefaultContext
    > implements Server <StateT, CustomT> {

    readonly koa : Koa<StateT, CustomT> = new Koa<StateT, CustomT>();
    #server : HttpServer|undefined;

    constructor(
        readonly config : ListenOptions = {},
        private middlewares : Middleware[] = [],
    ) {

        this.middlewares.forEach(this.koa.use);
    }

    get server() : HttpServer|undefined {

        return this.#server;
    }

    open () : Promise<HttpServer> {

        if(!this.#server) {

            return new Promise<void>((resolve, reject) => {

                this.#server = this.koa.listen(this.config, resolve);

            }).then(()=>this.server as HttpServer);
        }

        return Promise.resolve(this.#server);
    }

    close() : Promise<void> {

        return new Promise<void>((resolve, reject) => {

            if(this.#server) {

                this.#server.close((error)=>{

                    if(error) {

                        reject(error);

                    } else {

                        this.#server = undefined;
                        resolve();
                    }

                });

            } else {

                resolve();
            }
        });
    }
}
