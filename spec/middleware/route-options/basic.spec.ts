import Router from '../../../dist/router/standard';
import Server from '../../server';
import BindToServer from '../../../dist/router/append-server';
import Axios, {AxiosResponse} from 'axios';
import Route from '@alirya/http/route/route';
import {MethodPathParameter} from "../../../dist/middleware/method-path";
import {RouteOptionsParameters} from "../../../dist/middleware/route-options";

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

describe('empty', () => {

    let response : AxiosResponse<string>;

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());


    let router =  BindToServer(server, new Router());

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

        router.add(RouteOptionsParameters(routes));

        for (const route of routes) {
            router.add(MethodPathParameter(route));
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
