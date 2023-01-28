import Router from '../../../dist/router/middleware';
import Method from '../../../dist/middleware/method';
import Server from '../../server';
import BindToServer from '../../../dist/router/prepend-server';
import Axios, {AxiosResponse} from 'axios';
import Cors from "../../../dist/middleware/auto-cors";

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

describe('single', () => {

    let called : boolean = false;
    let response : AxiosResponse<string>;
    let data : string = '';

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());


    let router =  BindToServer(server, Router());

    it('add request', ()=>{

        let next = router.next(Cors());

        next.next(Method('POST')).next(function (ctx) {
            ctx.response.body = data;
            called = true;
            return ctx;
        });

    });

    it('send request', function (done) {

        Axios.options(`http://localhost:${server.config.port}`).then((res)=>{

            response = res;

        }).catch(fail).finally(done);
    });

    it('assert value', function () {

        expect(response.headers['access-control-allow-methods']).toEqual('POST');
        expect(response.headers['access-control-allow-origin']).toEqual('');
        expect(response.headers['vary']).toEqual('Origin');

        expect(response.data).toEqual(data);
        expect(called).toBe(false);
        expect(response.status).toEqual(204);
        expect(response.statusText).toEqual('No Content');
    });

});



describe('multi', () => {

    const methods : string[] = ['POST', 'GET', 'PATCH', 'PUT'];
    let called : boolean = false;
    let uncalled : boolean = false;

    let data : string = '';

    const server2 = Server();

    beforeAll(()=>server2.open());
    afterAll(()=>server2.close());


    let router =  BindToServer(server2, Router());

    let next = router.next(Cors());

    for(const method of methods) {

        it('add post request', ()=>{

            next.next(Method(method)).next(function (ctx) {

                ctx.response.body = data;
                called = true;
                return ctx;
            }).next(Method('DELETE')).next(function (ctx) {
                uncalled = true;
                return ctx;
            });
        });
    }

    let response : AxiosResponse<string>;

    for(const method of methods) {

        it('send request', function (done) {

            Axios.options(`http://localhost:${server2.config.port}`).then((res)=>{

                response = res;

            }).catch(fail).finally(done);
        });

        it('assert value', function () {

            expect(response.data).toEqual(data);
            expect(called).toBe(false);
            expect(uncalled).toBe(false);
            expect(response.status).toEqual(204);
            expect(response.statusText).toEqual('No Content');
        });

    }

});
