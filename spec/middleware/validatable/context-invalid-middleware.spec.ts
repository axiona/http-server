import Router from '../../../dist/router/standard.js';
import Server from '../../server.js';
import BindToServer from '../../../dist/router/append-server.js';
import Axios, {AxiosResponse} from 'axios';
import Validation from '../../../dist/middleware/validation.js';
import {PaymentRequiredParameters} from '@alirya/http/response/payment-required.js';
import ContextDataGuard from './context-data-guard.js';
import {ResponseParameters} from '../../../dist/middleware/response.js';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});


describe('invalid middleware', () => {

    let called : boolean = false;

    let data : string = 'string test';

    let response : AxiosResponse<string>;

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());

    let router =  BindToServer(server, new Router());

    it('add request', ()=>{

        router
            .add(Validation.Parameters(ContextDataGuard, undefined, ResponseParameters(PaymentRequiredParameters())))
            .add(function (ctx : any) {

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
