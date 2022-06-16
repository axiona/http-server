import Router from '../../../dist/router/standard';
import Server from '../../server';
import BindToServer from '../../../dist/router/append-server';
import Axios, {AxiosResponse} from 'axios';
import BodyText from '../../../dist/middleware/body-text';
import String from '../../../../string/dist/boolean/string';
import Validation from '../../../dist/middleware/validation';
import {FromResponseParameters} from '../../../dist/context/from-response';
import PaymentRequiredParameters from '../../../../http/dist/response/payment-required-parameters';
import ContextDataGuard from './context-data-guard';
import {ResponseParameters} from '../../../dist/middleware/response';

it("force console log", () => { spyOn(console, 'log').and.callThrough();});


describe('invalid', () => {

    let called : boolean = false;

    let data : string = 'string test';

    let response : AxiosResponse<string>;

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());

    let router =  BindToServer(server, new Router());

    it('add request', ()=>{

        router
            .add(Validation.Parameters(ContextDataGuard))
            .add(function (ctx) {

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
