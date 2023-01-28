import Router from '../../../dist/router/middleware';
import Server from '../../server';
import BindToServer from '../../../dist/router/append-server';
import Axios from 'axios';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});


describe('basic', function () {

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());

    let called : string[] = [];

    const router =  BindToServer(server, Router());

    router.next(function (ctx) {

        called.push('1 1');
        return ctx;

    }).next(function (ctx) {


        called.push('1 1 1');
        return ctx;

    }).next(function (ctx) {


        called.push('1 1 1 1');
        return ctx;
    });

    router.next(function (ctx) {

        ctx.status = 204;
        called.push('1 2');
        return ctx;

    });

    it('send request', function (done) {

        Axios.post(`http://localhost:${server.config.port}/path`).catch(fail).finally(done);
    });

    it('assert value', function () {

        expect(called).toEqual([
            '1 1',
            '1 1 1',
            '1 1 1 1',
            '1 2'
        ]);
    });
});
