import Router from '../../../dist/router/middleware';
import Server from '../../server';
import BindToServer from '../../../dist/router/append-server';
import {ValidatableResponseMessageParameters} from '../../../dist/middleware/validatable-response-message';
import Axios, {AxiosResponse} from 'axios';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

describe('parameters', () => {

    let response : AxiosResponse<string>;

    let called : boolean = false;

    const server = Server();

    let data = {data : 1};

    beforeAll(()=>server.open());
    afterAll(()=>server.close());

    let router =  BindToServer(server, Router());

    it('default', ()=>{

        router
            .next(function (context) {

                const validatable = {
                    valid : true,
                    message : ['message'],
                    value : 1
                };

                return Object.assign(context, {validatable});

            })
            .next(ValidatableResponseMessageParameters())
            .next(function (ctx) {

                ctx.response.body = data;
                called = true;

                return ctx;
            });

    });

    it('send request', function (done) {

        Axios.post(`http://localhost:${server.config.port}`).then((res)=>{

            response = res;

        }).catch(fail).finally(done);
    });


    it('assert value', function () {

        expect<any>(response.data).toEqual(data);
        expect(called).toBe(true);
        expect(response.status).toEqual(200);
        expect(response.statusText).toEqual('OK');
    });

});
