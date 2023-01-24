import Router from '../../../dist/router/middleware';
import Method from '../../../dist/middleware/method';
import Server from '../../server';
import BindToServer from '../../../dist/router/append-server';
import Axios, {AxiosResponse} from 'axios';
import {PathParameters} from '../../../dist/middleware/path';
import AutoOptions from '../../../dist/middleware/auto-options';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

describe('single', () => {

    let response : AxiosResponse<{name : string, address : string}>;
    let methods : string[] = ['POST', 'GET', 'PATCH', 'DELETE'];

    const server = Server();

    it('open', ()=>server.open());


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
