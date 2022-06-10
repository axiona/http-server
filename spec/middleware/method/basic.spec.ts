import Router from '../../../dist/router/standard';
import Method from '../../../dist/middleware/method';
import Server from '../../server';
import BindToServer from '../../../dist/router/append-server';
import Axios, {AxiosResponse} from 'axios';

it("force console log", () => { spyOn(console, 'log').and.callThrough();});

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


    let router =  BindToServer(server, new Router());


    it('add request', ()=>{

        router.add(Method('POST')).add(function (ctx) {
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

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());


    let router =  BindToServer(server, new Router());

    for(const method of methods) {

        it('add post request', ()=>{

            router.add(Method(method)).add(function (ctx) {
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

            Axios.post(`http://localhost:${server.config.port}`).then((res)=>{

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
