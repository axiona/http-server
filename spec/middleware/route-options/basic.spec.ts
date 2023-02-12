import Router from '../../../dist/router/middleware.js';
import Server from '../../server.js';
import BindToServer from '../../../dist/router/append-server.js';
import Axios, {AxiosResponse} from 'axios';
import Route from '@alirya/http/route/route.js';
import {MethodPathParameter} from '../../../dist/middleware/method-path.js';
import {RouteOptionsParameters} from '../../../dist/middleware/route-options.js';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

describe('empty', () => {

    let response : AxiosResponse<string>;

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());


    const router =  BindToServer(server, Router());

    const routes : Route[] = [
        {
            path: '/path/child',
            method: 'GET'
        },
        {
            path: '/path/child',
            method: 'PUT'
        }
    ];

    it('add request', ()=>{

        router.next(RouteOptionsParameters(routes));

        for (const route of routes) {
            router.next(MethodPathParameter(route));
        }

    });

    it('send request', function (done) {

        Axios.request({
            method : 'OPTIONS',
            url : `http://localhost:${server.config.port}/path/child`
        }).then(res=>{

            response = res;

        }).catch(fail).finally(done);
    });

    it('assert value', function () {

        expect(response.headers.allow).toEqual(routes.map(route=>route.method).join(', '));
        expect(response.status).toEqual(204);
        expect(response.statusText).toEqual('No Content');
    });

});
