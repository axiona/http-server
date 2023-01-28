import Router from '../../../dist/router/middleware';
import Server from '../../server';
import BindToServer from '../../../dist/router/append-server';
import Axios, {AxiosResponse} from 'axios';
import BodyJson from '../../../dist/middleware/body-json';

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

        router.next(BodyJson.Parameter()).next(function (ctx) {

            let data : Record<PropertyKey, any> = ctx.request.body;
            ctx.response.body = data;
            called = true;
            return ctx;
        });


    });

    it('send request', function (done) {

        Axios.post(`http://localhost:${server.config.port}`, data).then((res)=>{

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



