import Router from '../../../dist/router/middleware.js';
import Server from '../../server.js';
import BindToServer from '../../../dist/router/append-server.js';
import Axios, {AxiosResponse} from 'axios';
import BodyMultipart from '../../../dist/middleware/body-multipart.js';
import StrictAccept from '../../../dist/middleware/validate-accept.js';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

describe('single', () => {

    let called  = false;
    let response : AxiosResponse<{name : string, address : string}>;
    const data  = {
        root: {parent: {child : 'value 3'}},
        main: {parent: {child : ['array 1', 'array 2', 'array 3']}},
    };

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());

    const router =  BindToServer(server, Router());


    it('add request', ()=>{

        router
            .next(BodyMultipart({multiples:false}))
            .next(StrictAccept())
            .next(function (ctx) {

            const data : Record<PropertyKey, any> = ctx.request.body;
            ctx.response.body = data;
            called = true;
            return ctx;
        });

    });

    it('send request', function (done) {

        Axios.post(`http://localhost:${server.config.port}`, {}).then((res)=>{

            fail('response should failed');

        }).catch((error)=>{

            response = error.response;

        }).finally(done);
    });

    it('assert value', function () {

        expect<any>(response.data).toEqual('Unsupported Media Type');
        expect(called).toBe(false);
        expect(response.status).toEqual(415);
        expect(response.statusText).toEqual('Unsupported Media Type');
    });

});
