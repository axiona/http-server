import Axios, {AxiosResponse} from 'axios';
import Server from '../../server';
import BindToServer from '../../../dist/router/append-server';
import Router from '../../../dist/router/middleware';
import OneGuard from './one-guard';
import {ValidationParameters} from '../../../dist/middleware/validation';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});



describe('invalid', () => {

    let called : boolean = false;

    let data : string = 'string test';

    let response : AxiosResponse<string>;

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());

    let router =  BindToServer(server, Router());

    it('add request', ()=>{

        router
            .add(ValidationParameters(OneGuard, ['data']))
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

        expect<string>(response.data).toEqual('Not Found');
        expect(called).toBe(false);
        expect(response.status).toEqual(404);
        expect(response.statusText).toEqual('Not Found');
    });

});

