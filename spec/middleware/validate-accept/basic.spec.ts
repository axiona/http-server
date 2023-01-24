import Router from '../../../dist/router/middleware';
import Server from '../../server';
import BindToServer from '../../../dist/router/append-server';
import Axios, {AxiosResponse} from 'axios';
import BodyMultipart from '../../../dist/middleware/body-multipart';
import StrictAccept from "../../../dist/middleware/validate-accept";

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

describe('single', () => {

    let called : boolean = false;
    let response : AxiosResponse<{name : string, address : string}>;
    let data  = {
        root: {parent: {child : 'value 3'}},
        main: {parent: {child : ['array 1', 'array 2', 'array 3']}},
    };

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());

    let router =  BindToServer(server, Router());


    it('add request', ()=>{

        router
            .add(BodyMultipart({multiples:false}))
            .add(StrictAccept())
            .add(function (ctx) {

            let data : Record<PropertyKey, any> = ctx.request.body;
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
