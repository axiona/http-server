import Router from '../../../dist/router/standard';
import Server from '../../server';
import BindToServer from '../../../dist/router/append-server';
import Axios, {AxiosResponse} from 'axios';
import PathPattern from '../../../dist/middleware/path';
import AutoOptions from '../../../dist/middleware/auto-options';

it("force console log", () => { spyOn(console, 'log').and.callThrough();});

describe('empty', () => {

    let response : AxiosResponse<string>;

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());


    let router =  BindToServer(server, new Router());


    it('add request', ()=>{

        router.add(AutoOptions());
        router.add(PathPattern('/path/child'));

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
