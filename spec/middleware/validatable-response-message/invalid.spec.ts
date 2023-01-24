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
    let message = {
        value: 'value',
        message: 'data',
    };

    beforeAll(()=>server.open());
    afterAll(()=>server.close());

    let router =  BindToServer(server, Router());

    it('default', ()=>{

        router
            .add(function (context) {

                const validatable = {
                    valid : false,
                    message : message,
                    value : 1
                };

                return Object.assign(context, {validatable});

            })
            .add(ValidatableResponseMessageParameters())
            .add(function (ctx) {

                ctx.response.body = data;
                called = true;

                return ctx;
            });

    });

    it('send request', function (done) {

        Axios.post(`http://localhost:${server.config.port}`).then((res)=>{

            fail('request should failed');

        }).catch(e=>{

            response = e.response;

        }).finally(done);
    });


    it('assert value', function () {

        expect<any>(response.data).toEqual(message);
        expect(called).toBe(false);
        expect(response.status).toEqual(422);
        expect(response.statusText).toEqual('Unprocessable Entity');
    });

});
