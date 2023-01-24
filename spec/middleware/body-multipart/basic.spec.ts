import Router from '../../../dist/router/middleware';
import Server from '../../server';
import BindToServer from '../../../dist/router/append-server';
import Axios, {AxiosResponse} from 'axios';
import BodyMultipart from '../../../dist/middleware/body-multipart';
import FormData from 'form-data';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

describe('single', () => {

    let called : boolean = false;
    let response : AxiosResponse<{name : string, address : string}>;
    let data  = {
        root: {parent: {child : 'value 3'}},
        main: {parent: {child : ['array 1', 'array 2', 'array 3']}},
    };

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());

    let router =  BindToServer(server, Router());


    it('add request', ()=>{

        router.add(BodyMultipart({multiples:false})).add(function (ctx) {

            let data : Record<PropertyKey, any> = ctx.request.body;
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

    let called : boolean = false;
    let response : AxiosResponse<{name : string, address : string}>;
    let data  = {
        root: {parent: {child : 'value 3'}},
        main: {parent: {child : ['array 1', 'array 2', 'array 3']}},
    };

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());

    let router =  BindToServer(server, Router());


    it('add request', ()=>{

        router.add(BodyMultipart({multiples:true})).add(function (ctx) {

            let data : Record<PropertyKey, any> = ctx.request.body;
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
