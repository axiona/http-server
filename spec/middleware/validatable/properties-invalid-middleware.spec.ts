import Axios, {AxiosResponse} from 'axios';
import Server from '../../server';
import BindToServer from '../../../dist/router/append-server';
import Router from '../../../dist/router/standard';
import BodyText from '../../../dist/middleware/body-text';
import Validation from '../../../dist/middleware/validation';
import ContextDataGuard from './context-data-guard';
import {ResponseParameters} from '../../../dist/middleware/response';
import PaymentRequiredParameters from '../../../../http/dist/response/payment-required-parameters';
import OneGuard from './one-guard';
import {ValidationParameters} from '../../../dist/middleware/validation';

it("force console log", () => { spyOn(console, 'log').and.callThrough();});

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
            .add(ValidationParameters(ContextDataGuard, undefined, ResponseParameters(PaymentRequiredParameters())))
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
