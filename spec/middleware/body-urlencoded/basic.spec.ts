import Router from '../../../dist/router/middleware.js';
import Server from '../../server.js';
import BindToServer from '../../../dist/router/append-server.js';
import Axios, {AxiosResponse} from 'axios';
import FromRecord from '@alirya/uri/query/from-record.js';
import BodyForm from '../../../dist/middleware/body-urlencoded.js';

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

        router.next(BodyForm()).next(function (ctx) {

            const data : Record<PropertyKey, any> = ctx.request.body;
            ctx.response.body = data;
            called = true;
            return ctx;
        });

    });

    it('send request', function (done) {

        const query = new FromRecord(data);

        const headers = { 'content-type': 'application/x-www-form-urlencoded' };
        const queryString = query.toString();


        Axios.post(`http://localhost:${server.config.port}`, queryString, {headers}).then((res)=>{

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
