import Router from '../../../dist/router/middleware';
import Method from '../../../dist/middleware/method';
import Server from '../../server';
import BindToServer from '../../../dist/router/append-server';
import Axios, {AxiosResponse} from 'axios';
import {PathParameters} from '../../../dist/middleware/path';
import AutoOptions from '../../../dist/middleware/auto-options';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

describe('extend from path', () => {

    let response : AxiosResponse<{name : string, address : string}>;
    let methods : string[] = ['POST', 'GET', 'PATCH', 'DELETE', 'PUT'];

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());


    let router =  BindToServer(server, Router());


    it('add request', ()=>{

        let next = router.add(AutoOptions());
        const path = next.add(PathParameters('/path/child'));

        for (const method of methods) {

            path.add(Method(method)).add(ctx=>ctx);
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
