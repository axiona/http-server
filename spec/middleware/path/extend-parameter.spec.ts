import Router from '../../../dist/router/standard';
import PathPattern from '../../../dist/middleware/path';
import Server from '../../server';
import BindToServer from '../../../dist/router/append-server';
import Axios, {AxiosResponse} from 'axios';


it("force console log", () => { spyOn(console, 'log').and.callThrough();});


describe('single', () => {

    type Data = {
        parent ?: boolean,
        child ?: boolean,
    };



    let called1 : boolean = false;
    let called2 : boolean = false;

    let pathParameter : Record<string, string> = {};

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());


    let router =  BindToServer(server, new Router());


    it('add request', ()=>{

        router.add(PathPattern('/:main(parent)', {end:false})).add(function (ctx) {

            ctx.response.body = {
                parent : true,
            };
            pathParameter = ctx.request.pathParameter;
            called1 = true;
            return ctx;

        }).add(PathPattern(':sub(child)')).add(function (ctx) {

            ctx.response.body = Object.assign({ child : true }, ctx.response.body);

            pathParameter = ctx.request.pathParameter;
            called2 = true;
            return ctx;

        });

    });

    describe('match both', () => {

        let response : AxiosResponse<Data>;

        it('send request ', function (done) {

            Axios.post(`http://localhost:${server.config.port}/parent/child`).then((res)=>{

                response = res;

            }).catch(fail).finally(done);
        });

        it('assert value', function () {

            expect(called1).toBe(true);
            expect(called2).toBe(true);
            expect(pathParameter).toEqual({
                main: 'parent',
                sub: 'child',
            });

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

            Axios.post(`http://localhost:${server.config.port}/parent`).then((res)=>{

                response = res;

            }).catch(fail).finally(done);
        });

        it('assert value', function () {

            expect(called1).toBe(true);
            expect(called2).toBe(false);
            expect(pathParameter).toEqual({
                main: 'parent',
            });

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


    let router =  BindToServer(server, new Router());


    it('add first request', ()=>{

        router.add(PathPattern('/:main(parent1)', {end:false})).add(function (ctx) {

            ctx.response.body = {
                parent : 1,
            };

            pathParameter = ctx.request.pathParameter;
            called.parent1 = true;
            return ctx;

        }).add(PathPattern(':sub(child1)')).add(function (ctx) {

            ctx.response.body = Object.assign({
                child : 1
            }, ctx.response.body);

            pathParameter = ctx.request.pathParameter;
            called.child1 = true;
            return ctx;

        });

    });

    it('add second request', ()=>{

        router.add(PathPattern('/:main(parent2)', {end:false})).add(function (ctx) {

            ctx.response.body = {
                parent : 2,
            };

            pathParameter = ctx.request.pathParameter;
            called.parent2 = true;
            return ctx;

        }).add(PathPattern(':sub(child2)')).add(function (ctx) {

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
            expect(pathParameter).toEqual({
                main: 'parent1',
                sub: 'child1',
            });

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
            expect(pathParameter).toEqual({
                main: 'parent2',
                sub: 'child2',
            });

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
            expect(pathParameter).toEqual({
                main: 'parent1',
            });

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
            expect(pathParameter).toEqual({
                main: 'parent2',
            });

            expect(response.status).toEqual(200);
            expect(response.statusText).toEqual('OK');
            expect(response.data).toEqual({ parent : 2 });
        });

    });
});



