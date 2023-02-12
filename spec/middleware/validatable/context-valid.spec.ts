import Router from '../../../dist/router/middleware.js';
import Server from '../../server.js';
import BindToServer from '../../../dist/router/append-server.js';
import Axios, {AxiosResponse} from 'axios';
import BodyText from '../../../dist/middleware/body-text.js';
import Validation from '../../../dist/middleware/validation.js';
import ContextDataGuard from './context-data-guard.js';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

describe('valid', () => {

    let called  = false;

    const data  = 'string test';

    let response : AxiosResponse<string>;

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());

    const router =  BindToServer(server, Router());

    it('add request', ()=>{

        router
            .next(BodyText.Parameters())
            .next(function (context) {

                return Object.assign(context, {data:context.request.body as string|number|boolean});

            }).next(function (ctx) {
                const string : string|number|boolean = ctx.data;
                return ctx;
            })
            .next(Validation.Parameters(ContextDataGuard))
            .next(function (ctx) {
                const string : string = ctx.data;
                ctx.response.body = string;
                called = true;
                return ctx;
            });

    });


    it('send request', function (done) {

        Axios.post(`http://localhost:${server.config.port}`, data, {headers:{'content-type':'text/plain'}}).then((res)=>{

            response = res;

        }).catch(fail).finally(done);
    });

    it('assert value', function () {

        expect<string>(response.data).toEqual(data);
        expect(called).toBe(true);
        expect(response.status).toEqual(200);
        expect(response.statusText).toEqual('OK');
    });

});
