import Axios, {AxiosResponse} from 'axios';
import Server from '../../server';
import BindToServer from '../../../dist/router/append-server';
import Router from '../../../dist/router/middleware';
import BodyText from '../../../dist/middleware/body-text';
import OneGuard from './one-guard';
import {ValidationParameters} from '../../../dist/middleware/validation';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

describe('valid', () => {

    let called : boolean = false;

    let data : number = 1;

    let response : AxiosResponse<string>;

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());

    let router =  BindToServer(server, Router());

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
