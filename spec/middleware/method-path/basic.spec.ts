import Router from '../../../dist/router/middleware';
import Server from '../../server';
import BindToServer from '../../../dist/router/append-server';
import Axios, {AxiosResponse} from 'axios';
import {MethodPathParameter} from "../../../dist/middleware/method-path";
import Passthru from "../../../dist/middleware/passthrough";
import NoOp from '@alirya/function/no-op';
import {OmitParameters} from "../../../../object/dist/omit";

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

        router.next(MethodPathParameter({method:'POST', path:'/path/child'})).next(function (ctx) {
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
        '/path',
        '/path/child',
        '/path/child/granchild',
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


    let router =  BindToServer(server, Router());

    for(const path of paths) {

        for(const method of methods) {

            it('add post request', ()=>{

                router
                    .next(MethodPathParameter({method, path}))
                    .next(function (ctx) {
                    data.method = method;
                    ctx.response.body = data;
                    called = true;
                    return ctx;
                }).next(Passthru(NoOp) as any);

            });
        }
    }


    it('test parameter', () => {

        const actual =  (router.metadata.children).map(data=> {

            return Object.assign({}, data, {path:data.path.path, children:[]});

        });

        let data = actual.map(data=>OmitParameters(data, 'children'));

        expect<any>(data).toEqual([
                { headers: {}, method: [ 'POST' ], path: '/path' },
                { headers: {}, method: [ 'GET' ], path: '/path' },
                { headers: {}, method: [ 'PATCH' ], path: '/path' },
                { headers: {}, method: [ 'PUT' ], path: '/path' },
                { headers: {}, method: [ 'POST' ], path: '/path/child' },
                { headers: {}, method: [ 'GET' ], path: '/path/child' },
                { headers: {}, method: [ 'PATCH' ], path: '/path/child' },
                { headers: {}, method: [ 'PUT' ], path: '/path/child' },
                { headers: {}, method: [ 'POST' ], path: '/path/child/granchild' },
                { headers: {}, method: [ 'GET' ], path: '/path/child/granchild' },
                { headers: {}, method: [ 'PATCH' ], path: '/path/child/granchild' },
                { headers: {}, method: [ 'PUT' ], path: '/path/child/granchild' }
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
                expect(response.status).toEqual(200);
                expect(response.statusText).toEqual('OK');
            });

        }
    }

});
