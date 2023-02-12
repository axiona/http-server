import Router from '../../../dist/router/middleware.js';
import Server from '../../server.js';
import BindToServer from '../../../dist/router/append-server.js';
import Axios, {AxiosResponse} from 'axios';
import {PathParameters} from '../../../dist/middleware/path.js';
import AutoOptions from '../../../dist/middleware/auto-options.js';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

describe('empty', () => {

    let response : AxiosResponse<string>;

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());


    const router =  BindToServer(server, Router());


    it('add request', ()=>{

        router.next(AutoOptions());
        router.next(PathParameters('/path/child'));

    });

    it('send request', function (done) {

        Axios.request({
            method : 'OPTIONS',
            url : `http://localhost:${server.config.port}/path/child`
        }).then(response=>{

            fail('request should fail');

        }).catch(e=>{

            response = e.response;

        }).finally(done);
    });

    it('assert value', function () {

        expect(response.data).toEqual('Not Found');
        expect(response.status).toEqual(404);
        expect(response.statusText).toEqual('Not Found');
    });

});
