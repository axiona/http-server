import Router from '../../../dist/router/middleware';
import Method from '../../../dist/middleware/method';
import Server from '../../server';
import BindToServer from '../../../dist/router/prepend-server';
import Axios, {AxiosResponse} from 'axios';
import Cors from "../../../dist/middleware/auto-cors";

it('force console log', () => { spyOn(console, 'log').and.callThrough();});


describe('single', () => {

    let called : boolean = false;
    let response : AxiosResponse<{name : string, address : string}>;
    let data : {name : string, address : string} = {
        name : 'jhon',
        address : 'earth'
    };

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());


    let router =  BindToServer(server, Router());

    it('add request', ()=>{

        let next = router.add(Cors());

        next.add(Method('POST')).add(function (ctx) {
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
    let called : boolean = false;
    let uncalled : boolean = false;

    let data : Data = {
        name : 'jhon',
        address : 'earth',
        method : '',
    };

    const server2 = Server();

    beforeAll(()=>server2.open());
    afterAll(()=>server2.close());


    let router =  BindToServer(server2, Router());

    let next = router.add(Cors());

    for(const method of methods) {

        it('add post request', ()=>{

            next.add(Method(method)).add(function (ctx) {
                data.method = method;
                ctx.response.body = data;
                called = true;
                return ctx;
            }).add(Method('DELETE')).add(function (ctx) {
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
