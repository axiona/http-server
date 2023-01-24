import Router from '../../../dist/router/middleware';
import Server from '../../server';
import BindToServer from '../../../dist/router/append-server';
import Axios, {AxiosError, AxiosResponse} from 'axios';
import AutoOptions from '../../../dist/middleware/auto-options';
import {MethodPathParameter} from "../../../dist/middleware/method-path";

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

describe('extend from path', () => {

    let methods : string[] = ['POST', 'GET', 'PATCH', 'DELETE', 'PUT'];

    describe('slibing', () => {

        let error : AxiosError;
        const server = Server();

        beforeAll(()=>server.open());
        afterAll(()=>server.close());


        let router =  BindToServer(server, Router());


        it('add request', ()=>{

            router.add(AutoOptions());

            for (const method of methods) {

                router.add(MethodPathParameter({method, path:'/path/child'})).add(ctx=>ctx);
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


        let router =  BindToServer(server2, Router());


        it('add request', ()=>{

            let next = router.add(AutoOptions());

            for (const method of methods) {

                next.add(MethodPathParameter({method, path:'/path/child'})).add(ctx=>ctx);
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
