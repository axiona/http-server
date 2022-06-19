import Router from '../../../dist/router/standard';
import Server from '../../server';
import BindToServer from '../../../dist/router/append-server';
import Axios, {AxiosResponse} from 'axios';
import BodyText from '../../../dist/middleware/body-text';
import Validation from '../../../dist/middleware/validation';
import ContextDataGuard from './context-data-guard';

it("force console log", () => { spyOn(console, 'log').and.callThrough();});

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

                return Object.assign(context, {data:context.request.body as string|number|boolean});

            }).add(function (ctx) {
                const string : string|number|boolean = ctx.data;
                return ctx;
            })
            .add(Validation.Parameters(ContextDataGuard))
            .add(function (ctx) {
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
