import Router from '../../../dist/router/middleware.js';
import Server from '../../server.js';
import BindToServer from '../../../dist/router/append-server.js';
import Axios, {AxiosResponse} from 'axios';
import Validator from '../../../dist/middleware/validator.js';
import ContextValidator from './context-validator.js';
import BodyText from '../../../dist/middleware/body-text.js';

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

                return Object.assign(context, {data:context.request.body});

            })
            .next(Validator.Parameters(ContextValidator))
            .next(function (ctx) {

                // @ts-expect-error
                const boolean : boolean = ctx.data;
                // @ts-expect-error
                const object : object = ctx.data;
                // @ts-expect-error
                const number : number = ctx.data;
                // @ts-expect-error
                const record : Record<PropertyKey, any> = ctx.request.body;

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
            .next(Validator.Parameters(ContextValidator))
            .next(function (ctx) {

            // @ts-expect-error
            const boolean : boolean = ctx.data;
            // @ts-expect-error
            const object : object = ctx.data;
            // @ts-expect-error
            const number : number = ctx.data;
            // @ts-expect-error
            const record : Record<PropertyKey, any> = ctx.request.body;

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

        expect<string>(response.data).toEqual('invalid');
        expect(called).toBe(false);
        expect(response.status).toEqual(400);
        expect(response.statusText).toEqual('Bad Request');
    });

});
