import Router from '../../../dist/router/standard';
import Server from '../../server';
import BindToServer from '../../../dist/router/append-server';
import Axios, {AxiosResponse} from 'axios';
import FromRecord from '../../../../uri/dist/query/from-record';
import BodyForm from '../../../dist/middleware/body-urlencoded';

it("force console log", () => { spyOn(console, 'log').and.callThrough();});

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

    let router =  BindToServer(server, new Router());


    it('add request', ()=>{

        router.add(BodyForm()).add(function (ctx) {

            let data : Record<PropertyKey, any> = ctx.request.body;
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
