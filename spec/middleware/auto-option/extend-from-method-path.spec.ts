import Router from '../../../dist/router/standard';
import Server from '../../server';
import BindToServer from '../../../dist/router/append-server';
import Axios, {AxiosResponse} from 'axios';
import AutoOptions from '../../../dist/middleware/auto-options';
import {MethodPathParameter} from "../../../dist/middleware/method-path";

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

describe('extend from path', () => {

    let response : AxiosResponse<{name : string, address : string}>;
    let methods : string[] = ['POST', 'GET', 'PATCH', 'DELETE', 'PUT'];

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());


    let router =  BindToServer(server, new Router());


    it('add request', ()=>{

        router.add(AutoOptions());

        for (const method of methods) {

            router.add(MethodPathParameter({method, path:'/path/child'})).add(ctx=>ctx);
        }

    });

    it('send request', function (done) {

        Axios.request({
            method : 'OPTIONS',
            url : `http://localhost:${server.config.port}/path/child`
        }).then((res)=>{

            response = res;

        }).catch(fail).finally(done);
    });

    it('assert value', function () {

        expect(response.headers.allow).toEqual(methods.join(', '));
        expect(response.status).toEqual(204);
        expect(response.statusText).toEqual('No Content');
    });

});
