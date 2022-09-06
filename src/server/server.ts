import Koa, {DefaultContext, DefaultState} from 'koa';
import {Server as HttpServer} from 'http';
import {ListenOptions} from 'net';

export type ServerKoaOption = {
    env?: string,
    keys?: string[],
    proxy?: boolean,
    subdomainOffset?: number,
    proxyIpHeader?: string,
    maxIpsCount?: number,
};

export default interface Server<StateT = DefaultState, CustomT = DefaultContext> {

    readonly koa  : Koa<StateT, CustomT>;
    readonly server : HttpServer|undefined;
    readonly config : ListenOptions;
    open ():Promise<HttpServer>;
    close():Promise<this>;
}
