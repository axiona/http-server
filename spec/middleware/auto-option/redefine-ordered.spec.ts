import Router from '../../../dist/router/middleware.js';
import Method from '../../../dist/middleware/method.js';
import Server from '../../server.js';
import BindToServer from '../../../dist/router/append-server.js';
import Axios, {AxiosError, AxiosResponse} from 'axios';
import {PathParameters} from '../../../dist/middleware/path.js';
import AutoOptions from '../../../dist/middleware/auto-options.js';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

describe('single', () => {

    const methods : string[] = ['POST', 'GET', 'PATCH', 'DELETE', 'PUT'];

    describe('slibing', () => {

        // let response : AxiosResponse<{name : string, address : string}>;
        let error : AxiosError;
        const server = Server();

        beforeAll(()=>server.open());
        afterAll(()=>server.close());

        const router =  BindToServer(server, Router());

        it('add request', ()=>{

            router.next(AutoOptions());

            for (const method of methods) {

                router.next(Method(method)).next(PathParameters('/path/child')).next(ctx=>ctx);
            }
        });

        it('send request', function () {

            return Axios.request({
                method : 'OPTIONS',
                url : `http://localhost:${server.config.port}/path/child`
            }).then((res)=>{

                fail('request should fail');

            }).catch(e => {
                error = e;
            });
        });

        it('assert value', function () {

            expect((error.response as AxiosResponse).status).toEqual(404);
            expect((error.response as AxiosResponse).statusText).toEqual('Not Found');
        });

    });

    describe('children', () => {

        let response : AxiosResponse<{name : string, address : string}>;
        const server2 = Server();

        beforeAll(()=>server2.open());
        afterAll(()=>server2.close());

        const router =  BindToServer(server2, Router());

        it('add request', ()=>{

            const next = router.next(AutoOptions());

            for (const method of methods) {

                next.next(Method(method)).next(PathParameters('/path/child')).next(ctx=>ctx);
            }
        });

        it('send request', function (done) {

            Axios.request({
                method : 'OPTIONS',
                url : `http://localhost:${server2.config.port}/path/child`
            }).then((res)=>{

                response = res;

            }).catch(fail).finally(done);
        });

        it('assert value', function () {

            expect(response.headers.allow).toEqual(methods.join(', '));
            expect(response.status).toEqual(204);
            expect(response.statusText).toEqual('No Content');
        });

    });
});
