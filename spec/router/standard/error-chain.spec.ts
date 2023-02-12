import Router from '../../../dist/router/middleware.js';
import Server from '../../server.js';
import BindToServer from '../../../dist/router/append-server.js';
import Axios, {AxiosResponse} from 'axios';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

describe('basic', function () {

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());

    let response : AxiosResponse<{message:string}>;

    const router =  BindToServer(server, Router());

    const called : string[] = [];

    router.catch(function (ctx, error) {

        called.push('Catch 1');
        ctx.response.body = {message:error.message};

    }).catch(function (ctx, error) {

        called.push('Catch 2');
        throw error;

    }).extends(
        r=>r.catch(function (ctx, error) {

            called.push('Catch 3');
            throw error;

        }).catch(function (ctx, error) {

            called.push('Catch 4');
            throw error;

        })
    ).extends(
        r=>r.catch(function (ctx, error) {

            called.push('Catch 5');
            throw error;

        }).catch(function (ctx, error) {

            called.push('Catch 6');
            throw error;

        })
    ).next(function (context) {

        called.push('Throw 1');
        throw new Error('Throw 1');
    });

    it('send request', function (done) {

        Axios.post(`http://localhost:${server.config.port}`)
            .then(r=>response=r)
            .catch(fail)
            .finally(done);
    });

    it('assert value', function () {

        expect(response.data).toEqual({message:'Throw 1'});
        expect(called).toEqual([
            'Throw 1',
            'Catch 6',
            'Catch 5',
            'Catch 4',
            'Catch 3',
            'Catch 2',
            'Catch 1'
        ]);
    });
});