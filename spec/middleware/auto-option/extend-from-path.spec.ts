import Router from '../../../dist/router/middleware.js';
import Method from '../../../dist/middleware/method.js';
import Server from '../../server.js';
import BindToServer from '../../../dist/router/append-server.js';
import Axios, {AxiosResponse} from 'axios';
import {PathParameters} from '../../../dist/middleware/path.js';
import AutoOptions from '../../../dist/middleware/auto-options.js';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

describe('extend from path', () => {

    let response : AxiosResponse<{name : string, address : string}>;
    const methods : string[] = ['POST', 'GET', 'PATCH', 'DELETE', 'PUT'];

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());


    const router =  BindToServer(server, Router());


    it('add request', ()=>{

        const next = router.next(AutoOptions());
        const path = next.next(PathParameters('/path/child'));

        for (const method of methods) {

            path.next(Method(method)).next(ctx=>ctx);
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
