import Router from '../../../dist/router/middleware';
import {PathParameters} from '../../../dist/middleware/path';
import Server from '../../server';
import BindToServer from '../../../dist/router/append-server';
import Axios, {AxiosResponse} from 'axios';
import Metadata from "../../../dist/router/metadata/metadata";
import {ListParameter, ListType} from "../../../../uri/dist/path/list";


it('force console log', () => { spyOn(console, 'log').and.callThrough();});


describe('single', () => {

    type Data = {
        parent ?: boolean,
        child ?: boolean,
    };



    let called1 : boolean = false;
    let called2 : boolean = false;

    let pathParameter : Record<string, string> = {};
    let pathListType : ListType;

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());


    let router =  BindToServer(server, Router());


    it('add request', ()=>{

        router.add(PathParameters('/path', {end:false})).add(function (ctx) {

            ctx.response.body = {
                parent : true,
            };
            pathParameter = ctx.request.pathParameter;
            pathListType = ctx.request.paths;
            called1 = true;
            return ctx;

        }).add(PathParameters('child')).add(function (ctx) {

            ctx.response.body = Object.assign({ child : true }, ctx.response.body);

            pathParameter = ctx.request.pathParameter;
            pathListType = ctx.request.paths;
            called2 = true;
            return ctx;
        });

        // console.log(JSON.stringify(dump(router.metadata), null, 2));
        // console.log(JSON.stringify(router.metadata, null, 2));
    });

    describe('match both', () => {

        let response : AxiosResponse<Data>;

        it('send request ', function (done) {

            Axios.post(`http://localhost:${server.config.port}/path/child`).then((res)=>{

                response = res;

            }).catch(fail).finally(done);
        });

        it('assert value', function () {

            expect(called1).toBe(true);
            expect(called2).toBe(true);
            expect(pathParameter).toEqual({});
            expect(pathListType.toString()).toEqual(ListParameter({
                segments : 'path/child',
                empty : false,
                prefix: true
            }).toString());

            expect(response.status).toEqual(200);
            expect(response.statusText).toEqual('OK');
            expect(response.data).toEqual({ parent : true, child : true });
        });
    });


    it('reset value', function () {

        called1 = false;
        called2 = false;
    });

    describe('match parent', () => {

        let response : AxiosResponse<Data>;

        it('send request', function (done) {

            Axios.post(`http://localhost:${server.config.port}/path`).then((res)=>{

                response = res;

            }).catch(fail).finally(done);
        });

        it('assert value', function () {

            expect(called1).toBe(true);
            expect(called2).toBe(false);
            expect(pathListType.toString()).toEqual(ListParameter({
                segments : 'path',
                empty : false,
                prefix: true
            }).toString());
            expect(pathParameter).toEqual({});

            expect(response.status).toEqual(200);
            expect(response.statusText).toEqual('OK');
            expect(response.data).toEqual({ parent : true });
        });
    });

});



describe('multi', () => {

    type Data = {
        parent ?: number,
        child ?: number,
    };

    let called = {
        parent1 : false,
        parent2 : false,
        child1 : false,
        child2 : false,
    };

    let pathParameter : Record<string, string> = {};

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());


    let router =  BindToServer(server, Router());


    it('add first request', ()=>{

        router.add(PathParameters('/parent1', {end:false})).add(function (ctx) {

            ctx.response.body = {
                parent : 1,
            };

            pathParameter = ctx.request.pathParameter;
            called.parent1 = true;
            return ctx;

        }).add(PathParameters('child1')).add(function (ctx) {

            ctx.response.body = Object.assign({
                child : 1
            }, ctx.response.body);

            pathParameter = ctx.request.pathParameter;
            called.child1 = true;
            return ctx;

        });

    });

    it('add second request', ()=>{

        router.add(PathParameters('/parent2', {end:false})).add(function (ctx) {

            ctx.response.body = {
                parent : 2,
            };

            pathParameter = ctx.request.pathParameter;
            called.parent2 = true;
            return ctx;

        }).add(PathParameters('child2')).add(function (ctx) {

            ctx.response.body = Object.assign({
                child : 2
            }, ctx.response.body);

            pathParameter = ctx.request.pathParameter;
            called.child2 = true;
            return ctx;

        });

    });

    describe('both 1', () => {

        let response : AxiosResponse<Data>;

        it('send request', function (done) {

            Axios.post(`http://localhost:${server.config.port}/parent1/child1`).then((res)=>{

                response = res;

            }).catch(fail).finally(done);
        });

        it('assert value', function () {

            expect(called.parent1).toBe(true);
            expect(called.child1).toBe(true);
            expect(pathParameter).toEqual({});

            expect(response.status).toEqual(200);
            expect(response.statusText).toEqual('OK');
            expect(response.data).toEqual({ parent : 1, child : 1 });
        });
    });

    describe('both 2', () => {

        let response : AxiosResponse<Data>;

        it('send request', function (done) {

            Axios.post(`http://localhost:${server.config.port}/parent2/child2`).then((res)=>{

                response = res;

            }).catch(fail).finally(done);
        });

        it('assert value', function () {

            expect(called.parent2).toBe(true);
            expect(called.child2).toBe(true);
            expect(pathParameter).toEqual({});

            expect(response.status).toEqual(200);
            expect(response.statusText).toEqual('OK');
            expect(response.data).toEqual({ parent : 2, child : 2 });
        });
    });


    describe('parent 1', () => {

        let response : AxiosResponse<Data>;

        it('reset value', function () {

            called.parent1 = false;
            called.child1 = false;
        });

        it('send request', function (done) {

            Axios.post(`http://localhost:${server.config.port}/parent1`).then((res)=>{

                response = res;

            }).catch(fail).finally(done);
        });

        it('assert value', function () {

            expect(called.parent1).toBe(true);
            expect(called.child1).toBe(false);
            expect(pathParameter).toEqual({});

            expect(response.status).toEqual(200);
            expect(response.statusText).toEqual('OK');
            expect(response.data).toEqual({ parent : 1 });
        });

    });

    describe('parent 2', () => {

        let response : AxiosResponse<Data>;

        it('reset value', function () {

            called.parent2 = false;
            called.child2 = false;
        });

        it('send request', function (done) {

            Axios.post(`http://localhost:${server.config.port}/parent2`).then((res)=>{

                response = res;

            }).catch(fail).finally(done);
        });

        it('assert value', function () {

            expect(called.parent2).toBe(true);
            expect(called.child2).toBe(false);
            expect(pathParameter).toEqual({});

            expect(response.status).toEqual(200);
            expect(response.statusText).toEqual('OK');
            expect(response.data).toEqual({ parent : 2 });
        });

    });
});



describe('multi branch', () => {

    type Data = {
        parent ?: number,
        child ?: number,
    };

    let called = {
        parent1 : false,
        parent2 : false,
        child1 : false,
        child2 : false,
    };

    let pathParameter : Record<string, string> = {};

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());


    let router =  BindToServer(server, Router())
        .add(PathParameters('/root', {end:false}));


    it('add first request', ()=>{

        router.add(PathParameters('/parent1', {end:false})).add(function (ctx) {

            ctx.response.body = {
                parent : 1,
            };

            pathParameter = ctx.request.pathParameter;
            called.parent1 = true;
            return ctx;

        }).add(PathParameters('child1')).add(function (ctx) {

            ctx.response.body = Object.assign({
                child : 1
            }, ctx.response.body);

            pathParameter = ctx.request.pathParameter;
            called.child1 = true;
            return ctx;

        });

    });

    it('add second request', ()=>{

        router.add(PathParameters('/parent2', {end:false})).add(function (ctx) {

            ctx.response.body = {
                parent : 2,
            };

            pathParameter = ctx.request.pathParameter;
            called.parent2 = true;
            return ctx;

        }).add(PathParameters('child2')).add(function (ctx) {

            ctx.response.body = Object.assign({
                child : 2
            }, ctx.response.body);

            pathParameter = ctx.request.pathParameter;
            called.child2 = true;
            return ctx;

        });

    });

    describe('both 1', () => {

        let response : AxiosResponse<Data>;

        it('send request', function (done) {

            Axios.post(`http://localhost:${server.config.port}/root/parent1/child1`).then((res)=>{

                response = res;

            }).catch(fail).finally(done);
        });

        it('assert value', function () {

            expect(called.parent1).toBe(true);
            expect(called.child1).toBe(true);
            expect(pathParameter).toEqual({});

            expect(response.status).toEqual(200);
            expect(response.statusText).toEqual('OK');
            expect(response.data).toEqual({ parent : 1, child : 1 });
        });
    });

    describe('both 2', () => {

        let response : AxiosResponse<Data>;

        it('send request', function (done) {

            Axios.post(`http://localhost:${server.config.port}/root/parent2/child2`).then((res)=>{

                response = res;

            }).catch(fail).finally(done);
        });

        it('assert value', function () {

            expect(called.parent2).toBe(true);
            expect(called.child2).toBe(true);
            expect(pathParameter).toEqual({});

            expect(response.status).toEqual(200);
            expect(response.statusText).toEqual('OK');
            expect(response.data).toEqual({ parent : 2, child : 2 });
        });
    });


    describe('parent 1', () => {

        let response : AxiosResponse<Data>;

        it('reset value', function () {

            called.parent1 = false;
            called.child1 = false;
        });

        it('send request', function (done) {

            Axios.post(`http://localhost:${server.config.port}/root/parent1`).then((res)=>{

                response = res;

            }).catch(fail).finally(done);
        });

        it('assert value', function () {

            expect(called.parent1).toBe(true);
            expect(called.child1).toBe(false);
            expect(pathParameter).toEqual({});

            expect(response.status).toEqual(200);
            expect(response.statusText).toEqual('OK');
            expect(response.data).toEqual({ parent : 1 });
        });

    });

    describe('parent 2', () => {

        let response : AxiosResponse<Data>;

        it('reset value', function () {

            called.parent2 = false;
            called.child2 = false;
        });

        it('send request', function (done) {

            Axios.post(`http://localhost:${server.config.port}/root/parent2`).then((res)=>{

                response = res;

            }).catch(fail).finally(done);
        });

        it('assert value', function () {

            expect(called.parent2).toBe(true);
            expect(called.child2).toBe(false);
            expect(pathParameter).toEqual({});

            expect(response.status).toEqual(200);
            expect(response.statusText).toEqual('OK');
            expect(response.data).toEqual({ parent : 2 });
        });

    });
});

