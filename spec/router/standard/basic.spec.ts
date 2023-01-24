import Router from '../../../dist/router/middleware';
import Server from '../../server';
import BindToServer from '../../../dist/router/append-server';
import Axios, {AxiosResponse} from 'axios';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

describe('basic', function () {

    type Data = {
        name : string,
        address : string
    };

    const data : Data = {
        name : 'string',
        address : 'string'
    };

    const server = Server();
    let response : AxiosResponse<Data>;

    beforeAll(()=>server.open());
    afterAll(()=>server.close());

    let called : boolean = false;

    const router =  BindToServer(server, Router());

    router.add(function (ctx) {

        called = true;
        ctx.body = data;
        return ctx;

    });

    it('send request', function (done) {

        Axios.post(`http://localhost:${server.config.port}`).then(res=>{

            response = res;

        }).catch(fail).finally(done);
    });

    it('assert value', function () {

        expect(response.status).toBe(200);
        expect(response.statusText).toBe('OK');
        expect(response.data).toEqual(data);
        expect(called).toBeTrue();
    });
});

describe('204', function () {


    const server = Server();
    let response : AxiosResponse<''>;

    beforeAll(()=>server.open());
    afterAll(()=>server.close());

    let called : boolean = false;

    const router =  BindToServer(server, Router());

    router.add(function (ctx) {

        called = true;
        ctx.status = 204;
        return ctx;

    });

    it('send request', function (done) {

        Axios.post(`http://localhost:${server.config.port}`).then(res=>{

            response = res;

        }).catch(fail).finally(done);
    });

    it('assert value', function () {

        expect(response.status).toBe(204);
        expect(response.statusText).toBe('No Content');
        expect(response.data).toBe('');
        expect(called).toBeTrue();
    });
});
