import Router from '../../../dist/router/middleware.js';
import Server from '../../server.js';
import BindToServer from '../../../dist/router/append-server.js';
import Axios, {AxiosResponse} from 'axios';
import Validation from '../../../dist/middleware/validation.js';
import {PaymentRequiredParameters} from '@alirya/http/response/payment-required.js';
import ContextDataGuard from './context-data-guard.js';
import {ResponseParameters} from '../../../dist/middleware/response.js';
import Stop from '../../../dist/middleware/stop.js';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});


describe('invalid middleware', () => {

    let called  = false;

    const data  = 'string test';

    let response : AxiosResponse<string>;

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());

    const router =  BindToServer(server, Router());

    it('add request', ()=>{

        router
            .next(Validation.Parameters(ContextDataGuard, undefined, Stop(ResponseParameters(PaymentRequiredParameters()))))
            .next(function (ctx : any) {

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

        expect<string>(response.data).toEqual('Payment Required');
        expect(called).toBe(false);
        expect(response.status).toEqual(402);
        expect(response.statusText).toEqual('Payment Required');
    });

});
