import Koa, {DefaultContext, DefaultState} from 'koa';
import {Server as HttpServer} from 'http';
import Server, {ServerKoaOption} from './server';
import {ListenOptions} from 'net';

export default class Standard<
    StateT = DefaultState,
    CustomT = DefaultContext
    > implements Server <StateT, CustomT> {

    readonly koa : Koa<StateT, CustomT>;
    #server : HttpServer|undefined;

    constructor(
        readonly config : ListenOptions = {},
        koa : ServerKoaOption = {},
    ) {

        this.koa = new Koa<StateT, CustomT>(koa);
    }

    get server() : HttpServer|undefined {

        return this.#server;
    }

    open () : Promise<HttpServer> {

        if(!this.#server || !this.#server.listening) {

            return new Promise<void>((resolve, reject) => {

                this.#server = this.koa.listen(this.config, resolve);

            }).then(()=>this.server as HttpServer);
        }

        return Promise.resolve(this.#server);
    }

    close() : Promise<void> {

        return new Promise<void>((resolve, reject) => {

            if(!this.#server) {

                resolve();
                return;
            }

            if(!this.#server.listening) {

                resolve();
                this.#server = undefined;
                return;
            }

            this.#server.close((error)=>{

                if(error) {

                    reject(error);

                } else {

                    this.#server = undefined;
                    resolve();
                }
            });
        });
    }
}
