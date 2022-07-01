import Router from '../../../dist/router/standard';
import Server from '../../server';
import BindToServer from '../../../dist/router/append-server';
import Axios from 'axios';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

describe('basic', function () {

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());

    const router =  BindToServer(server, new Router());

    let called : string[] = [];

    router.catch(function (error, ctx) {

        called.push('1');
        return ctx;

    }).add(function (ctx) {

        called.push('1 1');
        return ctx;

    }).add(function (ctx) {

        called.push('1 1 E');
        throw new Error('Error');

    });

    router.add(function (ctx) {

        ctx.status = 204;

        called.push('2 1');
        return ctx;

    });

    it('send request', function (done) {

        Axios.post(`http://localhost:${server.config.port}`).catch(fail).finally(done);
    });

    it('assert value', function () {

        expect(called).toEqual([
            '1 1',
            '1 1 E',
            '1',
            '2 1'
        ]);
    });
});