import Router from '../../../dist/router/middleware.js';
import Method from '../../../dist/middleware/method.js';
import Server from '../../server.js';
import BindToServer from '../../../dist/router/prepend-server.js';
import Axios, {AxiosResponse} from 'axios';
import Cors from '../../../dist/middleware/auto-cors.js';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});


describe('single', () => {

    let called  = false;
    let response : AxiosResponse<{name : string, address : string}>;
    const data : {name : string, address : string} = {
        name : 'jhon',
        address : 'earth'
    };

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());


    const router =  BindToServer(server, Router());

    it('add request', ()=>{

        const next = router.next(Cors());

        next.next(Method('POST')).next(function (ctx) {
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

        expect(response.data).toEqual(data);
        expect(called).toBe(true);
        expect(response.status).toEqual(200);
        expect(response.statusText).toEqual('OK');
    });

});



describe('multi', () => {

    type Data = {
        name : string,
        address : string,
        method: string
    };
    const methods : string[] = ['POST', 'GET', 'PATCH', 'PUT'];
    let called  = false;
    let uncalled  = false;

    const data : Data = {
        name : 'jhon',
        address : 'earth',
        method : '',
    };

    const server2 = Server();

    beforeAll(()=>server2.open());
    afterAll(()=>server2.close());


    const router =  BindToServer(server2, Router());

    const next = router.next(Cors());

    for(const method of methods) {

        it('add post request', ()=>{

            next.next(Method(method)).next(function (ctx) {
                data.method = method;
                ctx.response.body = data;
                called = true;
                return ctx;
            }).next(Method('DELETE')).next(function (ctx) {
                uncalled = true;
                return ctx;
            });
        });
    }

    let response : AxiosResponse<Data>;

    for(const method of methods) {

        data.method = method;

        it('send request', function (done) {

            Axios.post(`http://localhost:${server2.config.port}`).then((res)=>{

                response = res;

            }).catch(fail).finally(done);
        });

        it('assert value', function () {

            expect(response.data).toEqual(data);
            expect(called).toBe(true);
            expect(uncalled).toBe(false);
            expect(response.status).toEqual(200);
            expect(response.statusText).toEqual('OK');
        });

    }

});
