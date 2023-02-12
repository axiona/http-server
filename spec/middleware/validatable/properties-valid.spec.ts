import Axios, {AxiosResponse} from 'axios';
import Server from '../../server.js';
import BindToServer from '../../../dist/router/append-server.js';
import Router from '../../../dist/router/middleware.js';
import BodyText from '../../../dist/middleware/body-text.js';
import OneGuard from './one-guard.js';
import {ValidationParameters} from '../../../dist/middleware/validation.js';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

describe('valid', () => {

    let called  = false;

    const data  = 1;

    let response : AxiosResponse<string>;

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());

    const router =  BindToServer(server, Router());

    it('add request', ()=>{

        router
            .next(BodyText.Parameters())
            .next(function (context) {

                return Object.assign(context, {data:parseInt(context.request.body) as string|number|boolean});

            })
            .next(ValidationParameters(OneGuard, ['data']))
            .next(function (ctx) {
                const data : 1 = ctx.data;
                ctx.response.body = (data + data).toString();
                called = true;
                return ctx;
            });

    });


    it('send request', function (done) {

        Axios.post(`http://localhost:${server.config.port}`, data.toString(), {headers:{'content-type':'text/plain'}}).then((res)=>{

            response = res;

        }).catch(fail).finally(done);
    });

    it('assert value', function () {
        expect(response.data.toString()).toEqual((data + data).toString());
        expect(called).toBe(true);
        expect(response.status).toEqual(200);
        expect(response.statusText).toEqual('OK');
    });

});
