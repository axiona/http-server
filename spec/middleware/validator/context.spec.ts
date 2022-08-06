import Router from '../../../dist/router/standard';
import Server from '../../server';
import BindToServer from '../../../dist/router/append-server';
import Axios, {AxiosResponse} from 'axios';
import Validator from '../../../dist/middleware/validator';
import ContextValidator from './context-validator';
import BodyText from '../../../dist/middleware/body-text';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

describe('valid', () => {

    let called : boolean = false;

    let data : string = 'string test';

    let response : AxiosResponse<string>;

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());

    let router =  BindToServer(server, new Router());

    it('add request', ()=>{

        router
            .add(BodyText.Parameters())
            .add(function (context) {

                return Object.assign(context, {data:context.request.body});

            })
            .add(Validator.Parameters(ContextValidator))
            .add(function (ctx) {

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

    let called : boolean = false;

    let data : string = 'string test';

    let response : AxiosResponse<string>;

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());

    let router =  BindToServer(server, new Router());

    it('add request', ()=>{

        router
            .add(Validator.Parameters(ContextValidator))
            .add(function (ctx) {

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
        expect(response.status).toEqual(422);
        expect(response.statusText).toEqual('Unprocessable Entity');
    });

});
