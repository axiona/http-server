import Router from '../../../dist/router/middleware.js';
import Server from '../../server.js';
import BindToServer from '../../../dist/router/append-server.js';
import Axios, {AxiosResponse} from 'axios';
import Validation from '../../../dist/middleware/validation.js';
import ContextDataGuard from './context-data-guard.js';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});


describe('invalid', () => {

    let called  = false;

    const data  = 'string test';

    let response : AxiosResponse<string>;

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());

    const router =  BindToServer(server, Router());

    it('add request', ()=>{

        router
            .next(Validation.Parameters(ContextDataGuard))
            .next(function (ctx) {

            const string : string = ctx.data;
            ctx.response.body = string;
            called = true;
            return ctx;
        });

    });


    it('send request', function (done) {

        Axios.post(`http://localhost:${server.config.port}`, data).then((res)=>{

            fail('request should failed');

        }).catch(e=>{

            response = e.response;

        }).finally(done);
    });

    it('assert value', function () {

        expect<string>(response.data).toEqual('Not Found');
        expect(called).toBe(false);
        expect(response.status).toEqual(404);
        expect(response.statusText).toEqual('Not Found');
    });

});
