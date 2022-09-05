import Router from '../../../dist/router/standard';
import Server from '../../server';
import BindToServer from '../../../dist/router/append-server';
import Axios, {AxiosResponse} from 'axios';
import {MethodPathParameter} from "../../../dist/middleware/method-path";
import FromRouter from "../../../dist/router/metadata/array/from-router";
import Passthru from "../../../dist/middleware/passthrough";
import NoOp from '@alirya/function/no-op';

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


    let router =  BindToServer(server, new Router());


    it('add request', ()=>{

        router.add(MethodPathParameter({method:'POST', path:'/path/child'})).add(function (ctx) {
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

    type Data = {
        name : string,
        address : string,
        method: string
    };
    const methods : string[] = ['POST', 'GET', 'PATCH', 'PUT'];
    const paths : string[] = [
        '/path/child',
        '/path/child/granchild',
        '/path',
    ];
    let called : boolean = false;

    let data : Data = {
        name : 'jhon',
        address : 'earth',
        method : '',
    };

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());


    let router =  BindToServer(server, new Router());

    for(const path of paths) {

        for(const method of methods) {

            it('add post request', ()=>{

                router.add(MethodPathParameter({method, path})).add(function (ctx) {
                    data.method = method;
                    ctx.response.body = data;
                    called = true;
                    return ctx;
                }).add(Passthru(NoOp) as any);

            });
        }
    }


    it('test parameter', () => {

        const actual = FromRouter(router).map(data=> {

            return Object.assign({}, data, {path:data.path.path});

        });

        expect<any>(actual).toEqual([
                { headers: {}, method: [], path: '' },
                { headers: {}, method: [ 'POST' ], path: '/path/child' },
                { headers: {}, method: [ 'POST' ], path: '/path/child' },
                { headers: {}, method: [ 'POST' ], path: '/path/child' },
                { headers: {}, method: [ 'GET' ], path: '/path/child' },
                { headers: {}, method: [ 'GET' ], path: '/path/child' },
                { headers: {}, method: [ 'GET' ], path: '/path/child' },
                { headers: {}, method: [ 'PATCH' ], path: '/path/child' },
                { headers: {}, method: [ 'PATCH' ], path: '/path/child' },
                { headers: {}, method: [ 'PATCH' ], path: '/path/child' },
                { headers: {}, method: [ 'PUT' ], path: '/path/child' },
                { headers: {}, method: [ 'PUT' ], path: '/path/child' },
                { headers: {}, method: [ 'PUT' ], path: '/path/child' },
                { headers: {}, method: [ 'POST' ], path: '/path/child/granchild' },
                { headers: {}, method: [ 'POST' ], path: '/path/child/granchild' },
                { headers: {}, method: [ 'POST' ], path: '/path/child/granchild' },
                { headers: {}, method: [ 'GET' ], path: '/path/child/granchild' },
                { headers: {}, method: [ 'GET' ], path: '/path/child/granchild' },
                { headers: {}, method: [ 'GET' ], path: '/path/child/granchild' },
                { headers: {}, method: [ 'PATCH' ], path: '/path/child/granchild' },
                { headers: {}, method: [ 'PATCH' ], path: '/path/child/granchild' },
                { headers: {}, method: [ 'PATCH' ], path: '/path/child/granchild' },
                { headers: {}, method: [ 'PUT' ], path: '/path/child/granchild' },
                { headers: {}, method: [ 'PUT' ], path: '/path/child/granchild' },
                { headers: {}, method: [ 'PUT' ], path: '/path/child/granchild' },
                { headers: {}, method: [ 'POST' ], path: '/path' },
                { headers: {}, method: [ 'POST' ], path: '/path' },
                { headers: {}, method: [ 'POST' ], path: '/path' },
                { headers: {}, method: [ 'GET' ], path: '/path' },
                { headers: {}, method: [ 'GET' ], path: '/path' },
                { headers: {}, method: [ 'GET' ], path: '/path' },
                { headers: {}, method: [ 'PATCH' ], path: '/path' },
                { headers: {}, method: [ 'PATCH' ], path: '/path' },
                { headers: {}, method: [ 'PATCH' ], path: '/path' },
                { headers: {}, method: [ 'PUT' ], path: '/path' },
                { headers: {}, method: [ 'PUT' ], path: '/path' },
                { headers: {}, method: [ 'PUT' ], path: '/path' }
            ]
        );

    });

    let response : AxiosResponse<Data>;

    for(const path of paths) {

        for(const method of methods) {

            data.method = method;

            it('send request', function (done) {

                Axios.post(`http://localhost:${server.config.port}/${path}`).then((res)=>{

                    response = res;

                }).catch(fail).finally(done);
            });

            it('assert value', function () {

                expect(response.data).toEqual(data);
                expect(called).toBe(true);
                // expect(uncalled).toBe(false);
                expect(response.status).toEqual(200);
                expect(response.statusText).toEqual('OK');
            });

        }
    }

});
