import Koa, {DefaultContext, DefaultState, Middleware} from 'koa';
import {Server as HttpServer} from 'http';
import Server from './server';
import {ListenOptions} from 'net';
// import Router from "@koa/router";
// import ApplicationContext from "../context/context";
// import State from "../context/state/infer";


export default class Standard<
    StateT = DefaultState,
    CustomT = DefaultContext
    > implements Server <StateT, CustomT> {

    readonly koa : Koa<StateT, CustomT> = new Koa<StateT, CustomT>();
    #server : HttpServer|undefined;
    // private router : Router = new Router();

    constructor(
        readonly config : ListenOptions = {},
        private middlewares : Middleware[] = [],
    ) {

        this.middlewares.forEach(this.koa.use);

        // this.koa.use(this.router.routes());
        // this.koa.use(this.router.allowedMethods());
    }

    // route() : Router<State<ApplicationContext<{}, {}, {}, DefaultContext>>, ApplicationContext<{}, {}, {}, DefaultContext>> {
    //
    //     return this.router as Router<State<ApplicationContext<{}, {}, {}, DefaultContext>>, ApplicationContext<{}, {}, {}, DefaultContext>>;
    // }

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
