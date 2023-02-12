import Router from '../../../dist/router/middleware.js';
import Method from '../../../dist/middleware/method.js';
import Server from '../../server.js';
import BindToServer from '../../../dist/router/append-server.js';
import Axios, {AxiosResponse} from 'axios';
import {PathParameters} from '../../../dist/middleware/path.js';
import AutoOptions from '../../../dist/middleware/auto-options.js';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

describe('single', () => {

    let response : AxiosResponse<{name : string, address : string}>;
    const methods : string[] = ['POST', 'GET', 'PATCH', 'DELETE'];

    const server = Server();

    it('open', ()=>server.open());


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
            method : 'PUT',
            url : `http://localhost:${server.config.port}/path/child`
        }).then(response=>{

            fail('request should fail');

        }).catch(e=>{

            response = e.response;

        }).finally(done);
    });

    it('assert value', function () {

        expect<string|undefined>(response.headers.allow as string|undefined).toEqual(undefined);
        expect(response.status).toEqual(405);
        expect(response.statusText).toEqual('Method Not Allowed');
    });

    it('close', ()=>server.close());

});
