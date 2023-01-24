import Router from '../../../dist/router/middleware';
import {PathParameters} from '../../../dist/middleware/path';
import Server from '../../server';
import BindToServer from '../../../dist/router/append-server';
import Axios, {AxiosResponse} from 'axios';


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


        router.add(PathParameters('/path/child')).add(function (ctx) {
            ctx.response.body = data;
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

        expect(response.data).toEqual(data);
        expect(called).toBe(true);
        expect(response.status).toEqual(200);
        expect(response.statusText).toEqual('OK');
    });

});


describe('multi', () => {

    let called1 : boolean = false;

    let response1 : AxiosResponse<{name : string, address : string}>;
    let data1 : {name : string, address : string} = {
        name : 'jhon',
        address : 'earth'
    };

    let called2 : boolean = false;
    let response2 : AxiosResponse<{name : string, address : string}>;
    let data2 : {name : string, address : string} = {
        name : 'jhon 2',
        address : 'earth 2'
    };

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());


    let router =  BindToServer(server, Router());


    it('add first request', ()=>{

        router.add(PathParameters('/path1/child1')).add(function (ctx) {
            ctx.response.body = data1;
            called1 = true;
            return ctx;
        });

    });

    it('add second request', ()=>{

        router.add(PathParameters('/path2/child2')).add(function (ctx) {
            ctx.response.body = data2;
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

        expect(response1.data).toEqual(data1);
        expect(called1).toBe(true);
        expect(response1.status).toEqual(200);
        expect(response1.statusText).toEqual('OK');
    });

    it('assert value 2', function () {

        expect(response2.data).toEqual(data2);
        expect(called2).toBe(true);
        expect(response2.status).toEqual(200);
        expect(response2.statusText).toEqual('OK');
    });

});
