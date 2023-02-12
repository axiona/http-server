import Router from '../../../dist/router/middleware.js';
import Server from '../../server.js';
import BindToServer from '../../../dist/router/append-server.js';
import Axios, {AxiosResponse} from 'axios';
import BodyMultipart from '../../../dist/middleware/body-multipart.js';
import FormData from "form-data";

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

describe('single', () => {

    let called  = false;
    let response : AxiosResponse<{name : string, address : string}>;
    const data  = {
        root: {parent: {child : 'value 3'}},
        main: {parent: {child : ['array 1', 'array 2', 'array 3']}},
    };

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());

    const router =  BindToServer(server, Router());


    it('add request', ()=>{

        router.next(BodyMultipart({multiples:false})).next(function (ctx) {

            const data : Record<PropertyKey, any> = ctx.request.body;
            ctx.response.body = data;
            called = true;
            return ctx;
        });

    });

    it('send request', function (done) {

        const form = new FormData();
        form.append('root[parent][child]', 'value 1');
        form.append('root[parent][child]', 'value 2');
        form.append('root[parent][child]', 'value 3');

        form.append('main[parent][child][]', 'array 1');
        form.append('main[parent][child][]', 'array 2');
        form.append('main[parent][child][]', 'array 3');

        Axios.post(`http://localhost:${server.config.port}`, form, {headers:form.getHeaders()}).then((res)=>{

            response = res;

        }).catch(fail).finally(done);
    });

    it('assert value', function () {

        expect<Record<PropertyKey, any>>(response.data).toEqual(data);
        expect(called).toBe(true);
        expect(response.status).toEqual(200);
        expect(response.statusText).toEqual('OK');
    });

});

describe('multiple', () => {

    let called  = false;
    let response : AxiosResponse<{name : string, address : string}>;
    const data  = {
        root: {parent: {child : 'value 3'}},
        main: {parent: {child : ['array 1', 'array 2', 'array 3']}},
    };

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());

    const router =  BindToServer(server, Router());


    it('add request', ()=>{

        router.next(BodyMultipart({multiples:true})).next(function (ctx) {

            const data : Record<PropertyKey, any> = ctx.request.body;
            ctx.response.body = data;
            called = true;
            return ctx;
        });

    });

    it('send request', function (done) {

        const form = new FormData();
        form.append('root[parent][child]', 'value 1');
        form.append('root[parent][child]', 'value 2');
        form.append('root[parent][child]', 'value 3');

        form.append('main[parent][child][]', 'array 1');
        form.append('main[parent][child][]', 'array 2');
        form.append('main[parent][child][]', 'array 3');

        Axios.post(`http://localhost:${server.config.port}`, form, {headers:form.getHeaders()})
            .then((res)=>{

            response = res;

        }).catch(fail).finally(done);
    });

    it('assert value', function () {

        expect<Record<PropertyKey, any>>(response.data).toEqual(data);
        expect(called).toBe(true);
        expect(response.status).toEqual(200);
        expect(response.statusText).toEqual('OK');
    });

});
