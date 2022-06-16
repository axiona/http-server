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

describe('valid', () => {

    let called : boolean = false;

    let data : number = 1;

    let response : AxiosResponse<string>;

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());

    let router =  BindToServer(server, new Router());

    it('add request', ()=>{

        router
            .add(BodyText.Parameters())
            .add(function (context) {

                return Object.assign(context, {data:parseInt(context.request.body) as string|number|boolean});

            })
            .add(ValidationParameters(OneGuard, ['data']))
            .add(function (ctx) {
                const data : 1 = ctx.data;
                ctx.response.body = data;
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

        expect(response.data).toEqual(data.toString());
        expect(called).toBe(true);
        expect(response.status).toEqual(200);
        expect(response.statusText).toEqual('OK');
    });

});
