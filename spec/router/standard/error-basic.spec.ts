import Router from '../../../dist/router/middleware';
import Server from '../../server';
import BindToServer from '../../../dist/router/append-server';
import Axios, {AxiosResponse} from 'axios';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

describe('caught', function () {

    const server = Server();

    let response : AxiosResponse<''>;

    beforeAll(()=>server.open());
    afterAll(()=>server.close());

    const router =  BindToServer(server, Router());

    let called : string[] = [];

    router.catch(function (ctx, error) {

        ctx.status = 204;

        called.push('1');

    }).add(function (ctx) {

        called.push('1 E');
        throw new Error('Error');

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
        expect(called).toEqual([
            '1 E',
            '1',
        ]);
    });
});

describe('uncaught', function () {

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());

    const router =  BindToServer(server, Router());

    let response : AxiosResponse<string>;

    let called : string[] = [];

    router.add(function (ctx) {

        called.push('1');
        return ctx;

    }).add(function (ctx) {

        ctx.status = 204;

        called.push('1 E');
        throw new Error('Intentionally Uncaught Error');

    });

    it('send request', function (done) {

        Axios.post(`http://localhost:${server.config.port}`).then(response=>{

            fail('request should fail');

        }).catch(e=>{

            response = e.response;

        }).finally(done);
    });

    it('assert value', function () {

        expect(response.status).toBe(500);
        expect(response.statusText).toBe('Internal Server Error');
        expect(response.data).toBe('Internal Server Error');
        expect(called).toEqual([
            '1',
            '1 E',
        ]);
    });
});