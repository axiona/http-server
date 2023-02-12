import Router from '../../../dist/router/middleware.js';
import {PathParameters} from '../../../dist/middleware/path.js';
import Server from '../../server.js';
import BindToServer from '../../../dist/router/append-server.js';
import Axios, {AxiosResponse} from 'axios';


it('force console log', () => { spyOn(console, 'log').and.callThrough();});


describe('single', () => {

    let called  = false;
    let response : AxiosResponse<{name : string, address : string}>;
    const data : {name : string, address : string} = {
        name : 'jhon',
        address : 'earth'
    };

    let pathParameter : Record<string, string> = {};
    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());


    const router =  BindToServer(server, Router());


    it('add request', ()=>{

        router.next(PathParameters('/:foo/:bar')).next(function (ctx) {
            ctx.response.body = data;
            pathParameter = ctx.request.pathParameter;
            called = true;
            return ctx;
        });


    });

    it('send request', function (done) {

        Axios.post(`http://localhost:${server.config.port}/path/child`).then((res)=>{

            response = res;

        }).catch(fail).finally(done);
    });

    it('assert value', function () {

        expect(pathParameter).toEqual({
            foo: 'path',
            bar: 'child',
        });
        expect(response.data).toEqual(data);
        expect(called).toBe(true);
        expect(response.status).toEqual(200);
        expect(response.statusText).toEqual('OK');
    });

});



describe('multi', () => {

    let called1  = false;

    let response1 : AxiosResponse<{name : string, address : string}>;
    const data1 : {name : string, address : string} = {
        name : 'jhon',
        address : 'earth'
    };

    let pathParameter1 : Record<string, string> = {};

    let called2  = false;
    let response2 : AxiosResponse<{name : string, address : string}>;
    const data2 : {name : string, address : string} = {
        name : 'jhon 2',
        address : 'earth 2'
    };

    let pathParameter2 : Record<string, string> = {};

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());


    const router =  BindToServer(server, Router());


    it('add first request', ()=>{

        router.next(PathParameters('/path1/:child1')).next(function (ctx) {
            ctx.response.body = data1;
            pathParameter1 = ctx.request.pathParameter;
            called1 = true;
            return ctx;
        });

    });

    it('add second request', ()=>{

        router.next(PathParameters('/path2/:child2')).next(function (ctx) {
            ctx.response.body = data2;
            pathParameter2 = ctx.request.pathParameter;
            called2 = true;
            return ctx;
        });


    });

    it('send request 1', function (done) {

        Axios.post(`http://localhost:${server.config.port}/path1/child1`).then((res)=>{

            response1 = res;

        }).catch(fail).finally(done);
    });

    it('send request 2', function (done) {

        Axios.post(`http://localhost:${server.config.port}/path2/child2`).then((res)=>{

            response2 = res;

        }).catch(fail).finally(done);
    });

    it('assert value 1', function () {

        expect(pathParameter1).toEqual({
            child1: 'child1',
        });
        expect(response1.data).toEqual(data1);
        expect(called1).toBe(true);
        expect(response1.status).toEqual(200);
        expect(response1.statusText).toEqual('OK');
    });

    it('assert value 2', function () {

        expect(pathParameter2).toEqual({
            child2: 'child2',
        });
        expect(response2.data).toEqual(data2);
        expect(called2).toBe(true);
        expect(response2.status).toEqual(200);
        expect(response2.statusText).toEqual('OK');
    });

});
