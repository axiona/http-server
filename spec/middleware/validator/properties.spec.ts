import Router from '../../../dist/router/middleware.js';
import Server from '../../server.js';
import BindToServer from '../../../dist/router/append-server.js';
import Axios, {AxiosResponse} from 'axios';
import BodyJson from '../../../dist/middleware/body-json.js';
import RecordValidator from './record-validator.js';
import Validator from '../../../dist/middleware/validator.js';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

describe('valid', () => {

    type Data = {
        name : string,
        address : string
    };

    let called  = false;

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());

    const router =  BindToServer(server, Router());

    it('add request', ()=>{

        router
            .next(BodyJson.Parameters())
            .next(Validator.Parameters(RecordValidator(), ['request', 'body']))
            .next(function (ctx) {

                ctx.response.body = ctx.request.body;
                called = true;
                return ctx;
            });

    });

    describe('valid', () => {

        const data : Data = {
            name : 'jhon',
            address : 'earth'
        };

        let response : AxiosResponse<Data>;
        called = false;

        it('send request', function (done) {

            Axios.post(`http://localhost:${server.config.port}`, data).then((res)=>{

                response = res;

            }).catch(fail).finally(done);
        });

        it('assert value', function () {

            expect(response.data).toEqual(data);
            expect(called).toBe(true);
            expect(response.status).toEqual(200);
            expect(response.statusText).toEqual('OK');
        });
    });


    describe('invalid', () => {

        let response : AxiosResponse<Data>;

        it('reset called', function () {

            called = false;
        });

        it('send request', function (done) {

            Axios.post(`http://localhost:${server.config.port}`, {}).then((res)=>{

                fail('request should failed');

            }).catch(e=>{

                response = e.response;

            }).finally(done);
        });

        it('assert value', function () {

            expect<any>(response.data).toEqual({ name: 'type must string, actual undefined.', address: 'type must string, actual undefined.' });
            expect(called).toBe(false);
            expect(response.status).toEqual(400);
            expect(response.statusText).toEqual('Bad Request');
        });
    });

});

