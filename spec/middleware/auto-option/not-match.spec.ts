import Router from '../../../dist/router/standard.js';
import Method from '../../../dist/middleware/method.js';
import Server from '../../server.js';
import BindToServer from '../../../dist/router/append-server.js';
import Axios, {AxiosResponse} from 'axios';
import PathPattern from '../../../dist/middleware/path.js';
import AutoOptions from '../../../dist/middleware/auto-options.js';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

describe('single', () => {

    let response : AxiosResponse<{name : string, address : string}>;
    let methods : string[] = ['POST', 'GET', 'PATCH', 'DELETE'];

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());


    let router =  BindToServer(server, new Router());


    it('add request', ()=>{

        router.add(AutoOptions());
        const path = router.add(PathPattern('/path/child'));

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

        expect(response.headers.allow).toEqual(undefined);
        expect(response.status).toEqual(405);
        expect(response.statusText).toEqual('Method Not Allowed');
    });

});
